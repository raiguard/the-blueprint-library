import Pako from "pako";
import { useState } from "react";

const decodeString = (string) => {
  return JSON.parse(Pako.inflate(atob(string.substr(1)), { to: "string" }));
};
const encodeString = (obj) => {
  return "0" + btoa(Pako.deflate(JSON.stringify(obj), { to: "string" }));
};

// processors
const processBook = (book) => {
  const base = processCommon(book);
};
const processCommon = (obj) => {};
const processPrint = (print) => {
  const base = processCommon(print);
};

// iteration
const readNextObj = (obj) => {
  // only process blueprints and blueprint books
  if (obj.blueprint_book) {
    const book = obj.blueprint_book;
    processBook(book);
    book.blueprints.forEach((child) => readNextObj(child));
  } else if (obj.blueprint) {
    const print = obj.blueprint;
    processPrint(print);
  }
};

// hook
const useBlueprintProcessor = () => {
  const [records, setRecords] = useState([]);

  const addRecord = (string) => {
    let raw = undefined;

    try {
      raw = decodeString(string);
    } catch {
      return {
        alert: "Invalid blueprint string"
      };
    }

    const record = readNextObj(raw);

    // setRecords([...records, record]);

    return {};
  };

  const removeRecord = (index) => {
    return {};
  };

  return [records, addRecord, removeRecord];
};

export default useBlueprintProcessor;
