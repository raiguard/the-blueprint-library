import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { decodeString } from "../../lib/stringEncoder";
import RecordsList from "../RecordsList/RecordsList";

export default () => {
  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const history = useHistory();
  const params = useParams();
  const postID = +params.postID;
  const userData = useSelector((state) => state.user);

  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRes = await Axios.get(`/api/post/${postID}`);
        // decompress records table
        let postData = postRes.data;
        postData.records = decodeString(postData.records);
        setPostData(postData);
        // comments
        const res = await Axios.get(`/api/comments/${postID}`);
        setComments(decodeString(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    // reset post data in case user is switching from one post to another
    setPostData(null);
    // fetch new post
    fetchPost();
  }, [postID]);

  const updateComments = async () => {
    const res = await Axios.get(`/api/comments/${postID}`);
    setComments(decodeString(res.data));
  };

  const postComment = async () => {
    if (comment.length === 0) {
      return alert("Cannot post an empty comment!");
    }
    await Axios.post("/api/comment", { postID, authorID: userData.id, content: comment });
    setComment("");
    await updateComments();
  };

  const deleteComment = async (ID) => {
    await Axios.delete(`/api/comment/${ID}`);
    await updateComments();
  };

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
          <section className="comments">
            {postData ? (
              <>
                <h1>Comments</h1>
                {userData.id && (
                  <div className="compose-comment">
                    <h2>Write a comment</h2>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                    <button onClick={postComment}>Comment</button>
                  </div>
                )}
                {comments.map((comment, i) => (
                  <div key={i} className="comment">
                    <label>{comment.content}</label>
                    {comment.author_id === userData.id && (
                      <button onClick={() => deleteComment(comment.id)}>Delete</button>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <label>Loading comments...</label>
            )}
          </section>
        </>
      ) : (
        <label>Loading post...</label>
      )}
    </main>
  );
};
