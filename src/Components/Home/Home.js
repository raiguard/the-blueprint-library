import React, { useState, useEffect } from "react";
import Axios from "axios";

export default () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // useEffect can't do async
    const fetchPosts = async () => {
      const res = await Axios.get(`/api/posts?query=${query}`);
      setPosts(res.data);
    };
    fetchPosts();
  }, [query]);

  return (
    <main className="home">
      <section className="search">
        <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </section>
      <section className="grid-view">
        {posts.map((post, i) => (
          <div className="post-card" key={i}>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
};
