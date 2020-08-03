import Axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { decodeString, encodeString } from "../../lib/stringEncoder";
import RecordsList from "../RecordsList/RecordsList";
import { v4 as randomString } from "uuid";

export default () => {
  const [title, setTitle] = useState("Test post, please ignore.");
  const [description, setDescription] = useState("This is definitely a test post. Please definitely ignore it!");
  const [img, setImg] = useState("");
  const [records, setRecords] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const userData = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const onDropAccepted = useCallback(async ([file]) => {
    setIsUploading(true);

    const fileName = `${randomString()}-${file.name.replace(/\s/g, "-")}`;

    try {
      const res = await Axios.get("/api/sign-s3", {
        params: {
          fileName,
          fileType: file.type
        }
      });
      const { signedRequest, url } = res.data;
      const options = {
        headers: {
          "Content-Type": file.type
        }
      };

      try {
        await Axios.put(signedRequest, file, options);
        setIsUploading(false);
        setImg(url);
      } catch (err) {
        setIsUploading(false);
        alert(`ERROR: ${err.status}\n ${err.stack}`);
      }
    } catch (err) {
      console.log(err.toJSON());
    }
  }, []);

  const onDropRejected = useCallback((files) => {
    console.log(files);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDropAccepted,
    onDropRejected
  });

  useEffect(() => {
    if (!userData.id) history.push("/");
  }, [history, userData]);

  useEffect(() => {
    setIsLoaded(false);
    const newIsEdit = location.pathname !== "/create";
    if (newIsEdit) {
      // fetch post information
      const fetchPost = async () => {
        const res = await Axios.get(`/api/post/${params.postID}`);
        const postData = res.data;
        setTitle(postData.title);
        setDescription(postData.description);
        setRecords(decodeString(postData.records));
        setIsLoaded(true);
      };
      fetchPost();
    } else setIsLoaded(true);
    setIsEdit(newIsEdit);
  }, [location, params.postID]);

  const validateInput = () => {
    if (title.length === 0) {
      alert("Cannot have an empty title.");
      return false;
    } else if (description.length === 0) {
      alert("Cannot have an empty description.");
      return false;
    } else if (img.length === 0) {
      alert("Must have an image.");
      return false;
    } else if (records.length === 0) {
      alert("Must have at least one record.");
      return false;
    }
    return true;
  };

  const uploadPost = async () => {
    // check inputs
    if (validateInput()) {
      // compress records before sending them
      const compressed = encodeString(records);
      const res = await Axios.post("/api/post", { title, img, description, records: compressed });
      history.push(`/post/${res.data.postID}`);
    }
  };

  const updatePost = async () => {
    // check inputs
    if (validateInput()) {
      // compress records before sending them
      const compressed = encodeString(records);
      await Axios.put(`/api/post/${params.postID}`, { title, img, description, records: compressed });
      history.push(`/post/${params.postID}`);
    }
  };

  const deletePost = async () => {
    await Axios.delete(`/api/post/${params.postID}`);
    history.push("/");
  };

  return (
    <main className="create-post">
      {isLoaded ? (
        <>
          <section className="textfield">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? <p>Drop image here...</p> : <p>Drag and drop image here, or click to select file</p>}
            </div>
            <img src={img} alt="Post img" />
          </section>
          <RecordsList defaultRecords={records} editable={true} setRecords={setRecords} />
          <button onClick={isEdit ? updatePost : uploadPost}>Post</button>
          {isEdit && <button onClick={deletePost}>Delete</button>}
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
