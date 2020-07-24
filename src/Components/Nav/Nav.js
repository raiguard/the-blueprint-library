import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default () => {
  const userData = useSelector((state) => state.user);
  const [authType, setAuthType] = useState(null);

  const toggleAuthType = (type) => {
    if (authType !== type) {
      setAuthType(type);
    } else {
      setAuthType(null);
    }
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
            <Link to="/profile">
              <label>Profile</label>
            </Link>
            <label>Sign out</label>
          </>
        ) : (
          <>
            <label onClick={() => toggleAuthType("Sign in")}>Sign in</label>
            <label onClick={() => toggleAuthType("Register")}>Register</label>
          </>
        )}
      </div>
      {authType && <Auth type={authType} />}
    </nav>
  );
};

export const Auth = (props) => {
  const checkCredentials = () => {
    alert(props.type);
  };

  return (
    <section className="auth">
      <AuthInput label="Username:" />
      <AuthInput label="Password:" onConfirm={checkCredentials} />
      <button onClick={checkCredentials}>{props.type}</button>
    </section>
  );
};

const AuthInput = ({ label, onConfirm }) => {
  const [value, setValue] = useState("");

  const checkForEnter = (e) => {
    if (onConfirm && e.which === 13) onConfirm();
  };

  return (
    <div className="auth-input">
      <h2>{label}</h2>
      <input onChange={(e) => setValue(e.target.value)} value={value} onKeyPress={checkForEnter} />
    </div>
  );
};
