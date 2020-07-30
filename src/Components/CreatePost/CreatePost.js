import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { encodeString } from "../../lib/stringEncoder";
import RecordsList from "../RecordsList/RecordsList";

export default () => {
  const [title, setTitle] = useState("Test post, please ignore.");
  const [description, setDescription] = useState("This is definitely a test post. Please definitely ignore it!");
  const [records, setRecords] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const userData = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (!userData.id) history.push("/");
  }, [history, userData]);

  useEffect(() => {
    setIsEdit(location.pathname !== "/create");
  }, [location]);

  const uploadPost = async () => {
    // compress records before sending them
    const compressed = encodeString(records);
    const res = await Axios.post("/api/post", { title, description, records: compressed });
    history.push(`/post/${res.data.postID}`);
  };

  const updatePost = async () => {
    // compress records before sending them
    const compressed = encodeString(records);
    await Axios.put("/api/post", { title, description, records: compressed });
    history.push(`/post/${params.postID}`);
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </section>
      <RecordsList editable={true} setRecords={setRecords} />
      <button onClick={isEdit ? updatePost : uploadPost}>Post</button>
    </main>
  );
};
