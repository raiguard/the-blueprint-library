import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";

import { clearUser, setUser } from "../../redux/reducer";

export default () => {
  const [authType, setAuthType] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const history = useHistory();

  // on mount
  useEffect(() => {
    // useEffect() does not support async callbacks, so we have to nest it inside
    const checkSession = async () => {
      const res = await Axios.get("/auth/me");
      if (res.data) {
        dispatch(setUser(res.data));
      }
    };
    checkSession();
  }, [dispatch]);

  const toggleAuthType = (type) => {
    if (authType !== type) {
      setAuthType(type);
    } else {
      setAuthType(null);
    }
  };

  const signOut = async () => {
    await Axios.post("/auth/signout");
    dispatch(clearUser());
    history.push("/");
  };

  return (
    <nav>
      <div className="nav-left-part">
        <Link to="/">
          <h1>The Blueprint Library</h1>
        </Link>
        {userData.username && (
          <Link to="/create">
            <label>Create</label>
          </Link>
        )}
        <Link to="/about">
          <label>About</label>
        </Link>
      </div>
      <div>
        {userData.username ? (
          <>
            <Link to={`/profile/${userData.id}`}>
              <label>Profile</label>
            </Link>
            <label onClick={signOut}>Sign out</label>
          </>
        ) : (
          <>
            <label onClick={() => toggleAuthType("Sign in")}>Sign in</label>
            <label onClick={() => toggleAuthType("Register")}>Register</label>
          </>
        )}
      </div>
      {authType && <Auth close={() => setAuthType(null)} type={authType} />}
    </nav>
  );
};

const Auth = ({ close, type }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const checkCredentials = async () => {
    if (type === "Register") {
      try {
        const res = await Axios.post("/auth/register", { username, password });
        dispatch(setUser(res.data));
        close();
      } catch {
        alert("Username already taken");
      }
    } else {
      try {
        const res = await Axios.post("/auth/signin", { username, password });
        dispatch(setUser(res.data));
        close();
      } catch {
        alert("Username or password is incorrect");
      }
    }
  };

  return (
    <section className="auth">
      <div className="auth-input">
        <h2>Username:</h2>
        <input onChange={(e) => setUsername(e.target.value)} value={username} />
      </div>
      <div className="auth-input">
        <h2>Password:</h2>
        <input onChange={(e) => setPassword(e.target.value)} value={password} />
      </div>
      <button onClick={checkCredentials}>{type}</button>
    </section>
  );
};
