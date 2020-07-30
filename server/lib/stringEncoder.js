const atob = require("atob");
const btoa = require("btoa");
const Pako = require("pako");

module.exports = {
  decode: (string) => {
    return JSON.parse(Pako.inflate(atob(string.substr(1)), { to: "string" }));
  },
  encode: (obj) => {
    return "0" + btoa(Pako.deflate(JSON.stringify(obj), { to: "string" }));
  }
};
