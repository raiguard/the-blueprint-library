import Axios from "axios";
import React, { useState } from "react";

export default () => {
  const [string, setString] = useState("");

  const testStringUpload = async () => {
    try {
      const res = await Axios.post("/test/string", { string });
      console.log(res.data);
    } catch (err) {
      alert(err.response.request.response);
    }
  };

  return (
    <main className="create-post">
      <section className="textfield">
        <input placeholder="Input string..." value={string} onChange={(e) => setString(e.target.value)} />
        <button onClick={testStringUpload}>Test</button>
      </section>
    </main>
  );
};
