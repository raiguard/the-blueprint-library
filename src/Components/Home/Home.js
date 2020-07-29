import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

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
          <Link key={i} className="post-card" to={`/posts/${post.id}`}>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
};
