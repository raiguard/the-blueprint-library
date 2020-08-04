import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default ({ query, userID }) => {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await Axios.get("/api/posts", { params: { query: query || "", userID } });
      setPosts(res.data);
    };
    fetchPosts();
  }, [query, userID]);

  return (
    <section className="posts-view">
      <section className="grid-view">
        {posts ? (
          posts.map((post, i) => (
            <Link key={i} className="post-card" to={`/post/${post.id}`}>
              <h1>{post.title}</h1>
              <p>{post.description}</p>
              <p>By {post.author_name}</p>
            </Link>
          ))
        ) : (
          <label>Loading posts...</label>
        )}
      </section>
    </section>
  );
};
