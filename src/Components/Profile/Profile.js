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
      setUserInfo(res);
    };
    fetchUserData();
  });

  return (
    <main className="profile">
      {userInfo ? (
        <section className="details">
          <h1>{userInfo.username}</h1>
          <img src={userInfo.avatar} alt="Avatar" />
          <PostsView userID={+userID} />
        </section>
      ) : (
        <label>Loading...</label>
      )}
    </main>
  );
};
