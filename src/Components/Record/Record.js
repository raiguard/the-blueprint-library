import React, { useState } from "react";

const Record = ({ data, index, remove }) => {
  const [showChildren, setShowChildren] = useState(false);

  const { type, name, description, string, children } = data;
  return (
    <div className="record">
      {remove && <button onClick={() => remove(index)}>Remove</button>}
      <h1>{name}</h1>
      <h2>{type}</h2>
      <p>{description}</p>
      <input value={string} readOnly />
      {children && children.length > 0 && (
        <>
          <button onClick={() => setShowChildren(!showChildren)}>Toggle children</button>
          {showChildren && children.map((child, i) => <Record key={i} data={child} />)}
        </>
      )}
    </div>
  );
};

export default Record;
