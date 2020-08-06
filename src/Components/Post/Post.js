import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
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
  const [editingCommentID, setEditingCommentID] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

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

  const updateComment = async () => {
    const res = await Axios.put(`/api/comment/${editingCommentID}`, { content: editingComment });
    setEditingComment(null);
    setEditingCommentID(null);
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
          <section className="upper-part">
            <section className="left-column">
              <div className="content-card">
                <div className="img-container">
                  <img src={postData.img} alt="Preview" />
                  <div className="overlay" />
                </div>
              </div>
              <div className="content-card metadata">
                <dl>
                  <dt>Author:</dt>
                  <dd>
                    <Link to={`/profile/${postData.author_id}`}>{postData.author_name}</Link>
                  </dd>
                </dl>
              </div>
              {userData && postData.author_id === userData.id && (
                <button className="edit-button" onClick={() => history.push(`/edit/${postID}`)}>
                  Edit
                </button>
              )}
            </section>
            <section className="right-column">
              <section className="content-card details">
                <h1>{postData.title}</h1>
                <p>{postData.description}</p>
              </section>
            </section>
          </section>
          <RecordsList defaultRecords={postData.records} />
          <section className="content-card comments">
            {postData ? (
              <>
                <h1>Comments ({comments.length})</h1>
                <div className="inset-panel">
                  {comments.map((comment, i) => (
                    <div key={i} className="comment">
                      <div className="comment-column">
                        <div className="img-container">
                          <img src={comment.author_avatar} alt="Avatar" />
                          <div className="overlay" />
                        </div>
                        {editingCommentID !== comment.id ? (
                          comment.author_id === userData.id && (
                            <button
                              onClick={() => {
                                setEditingCommentID(comment.id);
                                setEditingComment(comment.content);
                              }}
                            >
                              Edit
                            </button>
                          )
                        ) : (
                          <>
                            <button className="green-button" onClick={() => updateComment(comment.id)}>
                              Update
                            </button>
                            <button className="red-button" onClick={() => deleteComment(comment.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                      <div className="comment-column comment-right-column">
                        <h2>{comment.author_name}</h2>
                        {editingCommentID === comment.id ? (
                          <textarea
                            className="comment-content-area"
                            value={editingComment}
                            onChange={(e) => setEditingComment(e.target.value)}
                          />
                        ) : (
                          <label>{comment.content}</label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {userData.id && (
                  <div className="compose-comment">
                    <h2>Write a comment</h2>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                    <div className="button-row">
                      <button className="green-button" onClick={postComment}>
                        Comment
                      </button>
                    </div>
                  </div>
                )}
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
