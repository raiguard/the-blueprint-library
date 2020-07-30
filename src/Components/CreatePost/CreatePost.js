import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { encodeString } from "../../lib/stringEncoder";
import RecordsList from "../RecordsList/RecordsList";
import { useSelector } from "react-redux";

export default () => {
  const [title, setTitle] = useState("Test post, please ignore.");
  const [description, setDescription] = useState("This is definitely a test post. Please definitely ignore it!");
  const [records, setRecords] = useState([]);
  const history = useHistory();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData.id) history.push("/");
  }, [history, userData]);

  const uploadPost = async () => {
    // compress records before sending them
    const compressed = encodeString(records);
    const res = await Axios.post("/api/post", { title, description, records: compressed });
    history.push(`/post/${res.data.postID}`);
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </section>
      <RecordsList editable={true} setRecords={setRecords} />
      <button onClick={uploadPost}>Post</button>
    </main>
  );
};
