import Pako from "pako";
import { useState } from "react";

// decode and encode
const decodeString = (string) => {
  return JSON.parse(Pako.inflate(atob(string.substr(1)), { to: "string" }));
};
const encodeString = (obj) => {
  return "0" + btoa(Pako.deflate(JSON.stringify(obj), { to: "string" }));
};

// processors
const processors = {
  blueprint: (raw, print) => {
    print.type = "print";
    if (raw["snap-to-grid"]) {
      print.grid_snap_x = raw["snap-to-grid"].x;
      print.grid_snap_y = raw["snap-to-grid"].y;
    }
    print.absolute_snapping = raw["absolute-snapping"] || null;
    return print;
  },
  blueprint_book: (raw, book) => {
    book.type = "book";
    book.active_index = raw.active_index;
    book.children = [];
    return book;
  }
};

// iteration
const readRecord = (raw) => {
  const key = Object.keys(raw)[0];
  // only process blueprints and blueprint books
  if (!(key === "blueprint" || key === "blueprint_book")) {
    return "Upgrade and deconstruction planners are not supported.";
  }

  const rawObj = raw[key];

  const item = rawObj.item;
  if (!(item === "blueprint" || item === "blueprint-book")) {
    return "Only vanilla blueprints and blueprint books are supported.";
  }

  // common
  let record = {
    name: rawObj.label || null,
    description: rawObj.description || null,
    item: rawObj.item
  };

  if (rawObj.icons) {
    rawObj.icons.forEach((iconDef) => {
      record[`icon_${iconDef.index}`] = `${iconDef.signal.type}/${iconDef.signal.name}`;
    });
  }

  delete raw.index;
  record.string = encodeString(raw);

  // per-type
  record = processors[key](rawObj, record);

  // iterate over blueprint book children
  let error = null;
  if (key === "blueprint_book") {
    record.children = [];
    const children = rawObj.blueprints;
    for (let i = 0; i < children.length; i++) {
      const childRecord = readRecord(children[i]);
      if (typeof childRecord === "object") {
        childRecord.index = record.children.length + 1;
        record.children.push(childRecord);
      } else {
        error = childRecord;
        break;
      }
    }
  }

  return error || record;
};

// hook
const useBlueprintProcessor = (defaultRecords) => {
  const [records, setRecords] = useState(defaultRecords);

  const addRecord = (string) => {
    let raw = undefined;

    try {
      raw = decodeString(string);
    } catch {
      return {
        error: "Could not decode string"
      };
    }

    const record = readRecord(raw);
    if (typeof record === "object") {
      record.index = records.length;

      setRecords([...records, record]);

      return {};
    } else {
      return {
        error: record
      };
    }
  };

  const removeRecord = (index) => {
    let tempRecords = [...records];
    tempRecords.splice(index, 1);
    setRecords(tempRecords);
    return {};
  };

  return [records, addRecord, removeRecord];
};

export default useBlueprintProcessor;
