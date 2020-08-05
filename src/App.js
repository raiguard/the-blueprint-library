import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import { setUser } from "./redux/reducer";
import routes from "./routes";

library.add(far, fas);

export default () => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const dispatch = useDispatch();

  // check session for logged in user
  useEffect(() => {
    // useEffect() does not support async callbacks, so we have to nest it inside
    const checkSession = async () => {
      const res = await Axios.get("/auth/me");
      if (res.data) {
        dispatch(setUser(res.data));
      }
      setSessionChecked(true);
    };
    checkSession();
  }, [dispatch]);

  // do not render until the session has been checked
  // render the nav AFTER the main contents to guarantee that it's on top
  return (
    <div className="app">
      {sessionChecked && (
        <>
          {routes}
          <Nav />
        </>
      )}
    </div>
  );
};
