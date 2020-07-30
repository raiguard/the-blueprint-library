import React, { useState, useEffect } from "react";
import useBlueprintProcessor from "../../hooks/useBlueprintProcessor";
import sampleStrings from "../../sampleStrings";
import Record from "../Record/Record";

export default ({ editable, defaultRecords, setRecords }) => {
  const [string, setString] = useState(sampleStrings.book);
  const [records, addRecord, removeRecord] = useBlueprintProcessor(defaultRecords || []);

  useEffect(() => {
    setRecords && setRecords(records);
  }, [records, setRecords]);

  const addRecordToList = async () => {
    const status = await addRecord(string);
    if (status.error) {
      // TODO inline warnings, not alerts
      alert(status.error);
    } else if (setRecords) {
      setRecords(records);
    }
  };

  return (
    <section className="listing">
      {records.map((record, i) => (
        <Record key={i} data={record} index={i} remove={editable ? removeRecord : null} />
      ))}
      {editable && (
        <>
          <input placeholder="Input string..." value={string} onChange={(e) => setString(e.target.value)} />
          <button onClick={addRecordToList}>Add</button>
        </>
      )}
    </section>
  );
};
