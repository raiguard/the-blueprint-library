import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { clearUser, setUser } from "../../redux/reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMediaQuery } from "react-responsive";

export default () => {
  const [authType, setAuthType] = useState(null);
  const [showLinks, setShowLinks] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const history = useHistory();
  const location = useLocation();

  const isPhone = useMediaQuery({ query: "(max-width: 768px)" });

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

  useEffect(() => {
    setShowLinks(false);
  }, [location]);

  return (
    <div className="nav-background">
      <nav>
        <div className="upper-container">
          <Link to="/">
            <h1>The Blueprint Library</h1>
          </Link>
          {isPhone && (
            <button className="icon-button" onClick={() => setShowLinks(!showLinks)}>
              <FontAwesomeIcon icon={["fas", "bars"]} transform="up-3" />
            </button>
          )}
        </div>
        {(!isPhone || showLinks) && (
          <div className="links-container">
            <div>
              {userData.username && (
                <Link to="/create">
                  <label>Create</label>
                </Link>
              )}
              <Link to="/about">
                <label>About</label>
              </Link>
            </div>
            <div className="right-links">
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
          </div>
        )}
        {authType && <Auth close={() => setAuthType(null)} type={authType} />}
      </nav>
    </div>
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
      } catch (err) {
        alert(err.response.request.response);
      }
    } else {
      try {
        const res = await Axios.post("/auth/signin", { username, password });
        dispatch(setUser(res.data));
        close();
      } catch (err) {
        alert(err.response.request.response);
      }
    }
  };

  return (
    <section className="auth">
      <div className="auth-input">
        <h2>Username:</h2>
        <input name="username" onChange={(e) => setUsername(e.target.value)} value={username} />
      </div>
      <div className="auth-input">
        <h2>Password:</h2>
        <input name="password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      </div>
      <button onClick={checkCredentials}>{type}</button>
    </section>
  );
};
