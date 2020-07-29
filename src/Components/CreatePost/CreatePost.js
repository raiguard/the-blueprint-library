import React, { useState } from "react";
import Record from "../Record/Record";

import sampleStrings from "../../sampleStrings";
import useBlueprintProcessor from "../../hooks/useBlueprintProcessor";
import Axios from "axios";

export default () => {
  const [title, setTitle] = useState("Test post, please ignore.");
  const [description, setDescription] = useState("This is definitely a test post. Please definitely ignore it!");
  const [string, setString] = useState(sampleStrings.book);
  const [records, addRecord, removeRecord] = useBlueprintProcessor();

  const testStringProcessor = () => {
    const status = addRecord(string);
    if (status.error) {
      alert(status.error);
    }
  };

  const uploadPost = async () => {
    const res = await Axios.post("/api/post", { title, description, records });
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
