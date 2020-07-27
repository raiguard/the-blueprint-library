const atob = require("atob");
// const btoa = require("btoa");
const pako = require("pako");

module.exports = {
  test: async (req, res) => {
    const { string } = req.body;

    let output = null;

    // decode string
    try {
      output = JSON.parse(pako.inflate(atob(string.substr(1)), { to: "string" }));
    } catch {
      res.status(400).send("Invalid Factorio blueprint string");
    }
    res.status(200).send(output);
    // const deflated = pako.deflate(JSON.stringify(input), { to: "string" });
    // const encoded = btoa(deflated);
    // const output = "0" + encoded;
  }
};
