import Pako from "pako";
import { useState } from "react";

const decodeString = (string) => {
  return JSON.parse(Pako.inflate(atob(string.substr(1)), { to: "string" }));
};
const encodeString = (obj) => {
  return "0" + btoa(Pako.deflate(JSON.stringify(obj), { to: "string" }));
};

// processors
const processBook = (raw) => {
  let book = processCommon(raw);
  book.active_index = raw.active_index;
  book.children = [];
  return book;
};
const processCommon = (raw) => {
  let obj = {
    name: raw.label || null,
    description: raw.description || null,
    item: raw.item
  };

  if (raw.icons) {
    raw.icons.forEach((iconDef) => {
      obj[`icon_${iconDef.index}`] = `${iconDef.signal.type}/${iconDef.signal.name}`;
    });
  }

  return obj;
};
const processPrint = (raw) => {
  let print = processCommon(raw);
  if (raw.snap_to_grid) {
    print.grid_snap_x = raw.snap_to_grid.x;
    print.grid_snap_y = raw.snap_to_grid.y;
  }
  print.absolute_snapping = raw.absolute_snapping || null;
  return print;
};

// iteration
const readNext = (raw, index) => {
  // only process blueprints and blueprint books
  if (raw.blueprint_book) {
    const rawObj = raw.blueprint_book;
    let book = processBook(rawObj);
    book.type = "book";
    book.index = raw.index || index;
    delete raw.index;
    book.string = encodeString(raw);
    rawObj.blueprints.forEach((child) => book.children.push(readNext(child)));
    return book;
  } else if (raw.blueprint) {
    const rawObj = raw.blueprint;
    let print = processPrint(rawObj);
    print.type = "print";
    print.index = raw.index || index;
    delete raw.index;
    print.string = encodeString(raw);
    return print;
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

    const record = readNext(raw, records.length);

    setRecords(records.push(record));

    return {};
  };

  const removeRecord = (index) => {
    setRecords(records.splice(index));
    return {};
  };

  return [records, addRecord, removeRecord];
};

export default useBlueprintProcessor;
