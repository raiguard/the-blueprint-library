import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default () => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState(null);
  const { userID } = useParams();

  // WHERE YOU ARE:
  // getAll endpoint is failing somewhere, check debug console
  // Potentially extract grid view into a separate component?

  useEffect(() => {
    const fetchData = async () => {
      const postsRes = await Axios.get("/api/posts", { params: { query: "", userID } });
      setPosts(postsRes.data);
    };
    fetchData();
  }, [userID]);

  return (
    <main className="profile">
      <section className="details">
        <section className="grid-view">
          {posts ? (
            posts.map((post, i) => (
              <Link key={i} className="post-card" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
                <p>{post.description}</p>
                <p>Likes: {post.likes}</p>
                <p>By {post.author_name}</p>
              </Link>
            ))
          ) : (
            <label>Loading posts...</label>
          )}
        </section>
      </section>
    </main>
  );
};
