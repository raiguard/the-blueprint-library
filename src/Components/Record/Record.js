import React from "react";

const Record = ({ data }) => {
  const { type, name, description, string } = data;
  const children = data.children || [];
  return (
    <div className="record">
      <h1>{name}</h1>
      <h2>{type}</h2>
      <p>{description}</p>
      <input value={string} readOnly />
      {children.map((child, i) => (
        <Record key={i} data={child} />
      ))}
    </div>
  );
};

export default Record;
