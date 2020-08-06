import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostsView from "../PostsView/PostsView";

export default () => {
  const [userInfo, setUserInfo] = useState(null);
  const { userID } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await Axios.get(`/api/user/${userID}`);
      setUserInfo(res.data);
    };
    fetchUserData();
  });

  return (
    <main className="profile">
      {userInfo ? (
        <>
          <section className="content-card details">
            <div className="img-container">
              <img src={userInfo.avatar} alt="Avatar" />
              <div className="overlay" />
            </div>
            <h1>{userInfo.username}</h1>
          </section>
          <PostsView userID={+userID} />
        </>
      ) : (
        <label>Loading...</label>
      )}
    </main>
  );
};
