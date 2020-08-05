import React, { useState } from "react";

const Record = ({ data, index, remove }) => {
  const [showChildren, setShowChildren] = useState(false);

  const { type, name, description, string, children } = data;
  return (
    <div className="record">
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
        <input value={string} readOnly />
        <button onClick={() => setShowChildren(!showChildren)}>Toggle children</button>
      </div>
      {remove && <button onClick={() => remove(index)}>Remove</button>}
      {children && children.length > 0 && (
        <div className="inset-panel children-container">
          {showChildren && children.map((child, i) => <Record key={i} data={child} />)}
        </div>
      )}
    </div>
  );
};

export default Record;
