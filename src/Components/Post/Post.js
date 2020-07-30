import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecordsList from "../RecordsList/RecordsList";

export default () => {
  const [postData, setPostData] = useState(null);
  const params = useParams();
  const postID = +params.postID;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/api/post/${postID}`);
        setPostData(res.data);
      } catch (err) {
        alert(err.response.request.response);
      }
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
          <RecordsList defaultRecords={postData.records} />
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
