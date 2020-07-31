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

  return (
    <main className="post">
      {postData ? (
        <>
          <section className="details">
            <h1>{postData.title}</h1>
            <p>{postData.author_name}</p>
            <p>{postData.description}</p>
            <p>{postData.likes}</p>
          </section>
          <RecordsList defaultRecords={postData.records} />
          {userData && postData.author_id === userData.id && (
            <section className="buttons">
              <button onClick={() => history.push(`/edit/${postID}`)}>Edit</button>
            </section>
          )}
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
