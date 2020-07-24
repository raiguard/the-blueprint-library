import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import { setUser } from "./redux/reducer";
import routes from "./routes";

export default () => {
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();

  // check session for logged in user
  useEffect(() => {
    // useEffect() does not support async callbacks, so we have to nest it inside
    const checkSession = async () => {
      const res = await Axios.get("/auth/me");
      if (res.data) {
        dispatch(setUser(res.data));
      }
      setAuthenticated(true);
    };
    checkSession();
  }, [dispatch]);

  // do not render until the session has been checked
  return (
    <div className="app">
      {authenticated && (
        <>
          <Nav />
          <main>{routes}</main>
        </>
      )}
    </div>
  );
};
