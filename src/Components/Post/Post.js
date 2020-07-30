import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { decodeString } from "../../lib/stringEncoder";
import RecordsList from "../RecordsList/RecordsList";

export default () => {
  const [postData, setPostData] = useState(null);
  const history = useHistory();
  const params = useParams();
  const postID = +params.postID;
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await Axios.get(`/api/post/${postID}`);
        // decompress records table
        let postData = res.data;
        postData.records = decodeString(postData.records);
        setPostData(postData);
      } catch (err) {
        alert(err.response.request.response);
      }
    };
    // reset post data in case user is switching from one post to another
    setPostData(null);
    // fetch new post
    fetchPost();
  }, [postID]);

  const deletePost = async () => {
    await Axios.delete(`/api/post/${postID}`);
    history.push("/");
  };

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
          {userData && postData.author_id === userData.id && <button onClick={deletePost}>Delete</button>}
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
