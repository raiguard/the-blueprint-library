import Axios from "axios";
import React, { useState } from "react";
import Record from "../Record/Record";

import sampleStrings from "../../sampleStrings";
import useBlueprintProcessor from "../../hooks/useBlueprintProcessor";

export default () => {
  const [string, setString] = useState(sampleStrings.book);
  const [records, addRecord, removeRecord] = useBlueprintProcessor();

  // const testStringUpload = async () => {
  //   try {
  //     const res = await Axios.post("/test/string", { string });
  //     console.log(res.data);
  //   } catch (err) {
  //     alert(err.response.request.response);
  //   }
  // };

  const testStringProcessor = async () => {
    const status = await addRecord(string);
    console.log(records);
    if (status.alert) {
      alert(status.alert);
    }
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Input string..." value={string} onChange={(e) => setString(e.target.value)} />
        <button onClick={testStringProcessor}>Add</button>
      </section>
      <section className="listing"></section>
    </main>
  );
};
