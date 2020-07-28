import Axios from "axios";
import React, { useState } from "react";
import Record from "../Record/Record";

import sampleStrings from "../../sampleStrings";
import useBlueprintProcessor from "../../hooks/useBlueprintProcessor";

export default () => {
  const [string, setString] = useState(sampleStrings.book);
  const [records, addRecord, removeRecord] = useBlueprintProcessor();

  const testStringProcessor = () => {
    const status = addRecord(string);
    if (status.error) {
      alert(status.error);
    }
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Input string..." value={string} onChange={(e) => setString(e.target.value)} />
        <button onClick={testStringProcessor}>Add</button>
      </section>
      <section className="listing">
        {records.map((record, i) => (
          <Record key={i} data={record} />
        ))}
      </section>
    </main>
  );
};
