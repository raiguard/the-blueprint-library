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
              <div className="img-container">
                <img src={post.img} alt="Post preview" />
              </div>
              <div className="right-column">
                <h1>{post.title}</h1>
                <p>
                  By <Link to={`/profile/${post.author_id}`}>{post.author_name}</Link>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <label>Loading posts...</label>
        )}
      </section>
    </section>
  );
};
