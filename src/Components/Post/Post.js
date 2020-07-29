import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default () => {
  const [postData, setPostData] = useState(null);
  const params = useParams();
  const postID = +params.postID;

  useEffect(() => {
    const fetchPost = async () => {
      const res = await Axios.get(`/api/post/${postID}`);
      setPostData(res.data);
    };
    // reset post data in case user is switching from one post to another
    setPostData(null);
    // fetch new post
    fetchPost();
  }, [postID]);

  return (
    <main className="post">
      {postData ? (
        <>
          <section>
            <h1>{postData.title}</h1>
            <h2>{postData.author_id}</h2>
            <p>{postData.description}</p>
          </section>
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
