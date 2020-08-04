import React, { useState } from "react";
import PostsView from "../PostsView/PostsView";

export default () => {
  const [query, setQuery] = useState("");

  return (
    <main className="home">
      <section className="search">
        <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </section>
      <PostsView query={query} />
    </main>
  );
};
