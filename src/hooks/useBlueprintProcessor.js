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
    if (raw.snap_to_grid) {
      print.grid_snap_x = raw.snap_to_grid.x;
      print.grid_snap_y = raw.snap_to_grid.y;
    }
    print.absolute_snapping = raw.absolute_snapping || null;
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
const readNext = (raw) => {
  const key = Object.keys(raw)[0];
  // only process blueprints and blueprint books
  if (key === "blueprint" || key === "blueprint_book") {
    const rawObj = raw[key];

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
    let error = null;
    if (key === "blueprint_book") {
      record.children = [];
      rawObj.blueprints.forEach((child) => {
        if (!error) {
          const childRecord = readNext(child);
          if (typeof childRecord === "object") {
            childRecord.index = record.children.length + 1;
            record.children.push(childRecord);
          } else {
            error = childRecord;
          }
        }
      });
    }

    return error || record;
  } else {
    return "Upgrade and deconstruction planners are not supported.";
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
        error: "Could not decode string"
      };
    }

    const record = readNext(raw);
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
    setRecords([...records].splice(index));
    return {};
  };

  return [records, addRecord, removeRecord];
};

export default useBlueprintProcessor;
