import Axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useBlueprintProcessor from "../../hooks/useBlueprintProcessor";
import sampleStrings from "../../sampleStrings";
import Record from "../Record/Record";

export default () => {
  const [title, setTitle] = useState("Test post, please ignore.");
  const [description, setDescription] = useState("This is definitely a test post. Please definitely ignore it!");
  const [string, setString] = useState(sampleStrings.book);
  const [records, addRecord, removeRecord] = useBlueprintProcessor();
  const history = useHistory();

  const testStringProcessor = () => {
    const status = addRecord(string);
    if (status.error) {
      alert(status.error);
    }
  };

  const uploadPost = async () => {
    const res = await Axios.post("/api/post", { title, description, records });
    history.push(`/post/${res.data.postID}`);
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Input string..." value={string} onChange={(e) => setString(e.target.value)} />
        <button onClick={testStringProcessor}>Add</button>
      </section>
      <section className="listing">
        {records.map((record, i) => (
          <Record key={i} data={record} index={i} remove={removeRecord} />
        ))}
      </section>
      <button onClick={uploadPost}>Post</button>
    </main>
  );
};
