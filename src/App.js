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
  // render the nav AFTER the main contents to guarantee that it's on top
  return (
    <div className="app">
      {authenticated && (
        <>
          <main>{routes}</main>
          <Nav />
        </>
      )}
    </div>
  );
};
