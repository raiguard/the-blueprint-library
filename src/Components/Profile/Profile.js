import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default () => {
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState(null);
  const { userID } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await Axios.get(`/api/user/${userID}`);
      setUserInfo(userRes.data);
      const postsRes = await Axios.get("/api/posts", { params: { query: "", userID } });
      setPosts(postsRes.data);
      setLoaded(true);
    };
    fetchData();
  }, [userID]);

  return (
    <main className="profile">
      {loaded ? (
        <section className="details">
          <h1>{userInfo.username}</h1>
          <img src={userInfo.avatar} alt="Avatar" />
          <section className="grid-view">
            {posts.map((post, i) => (
              <Link key={i} className="post-card" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
                <p>{post.description}</p>
                <p>Likes: {post.likes}</p>
                <p>By {post.author_name}</p>
              </Link>
            ))}
          </section>
        </section>
      ) : (
        <label>Loading...</label>
      )}
    </main>
  );
};
