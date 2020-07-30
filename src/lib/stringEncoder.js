import Pako from "pako";

export const decodeString = (string) => {
  return JSON.parse(Pako.inflate(atob(string.substr(1)), { to: "string" }));
};

export const encodeString = (obj) => {
  return "0" + btoa(Pako.deflate(JSON.stringify(obj), { to: "string" }));
};
