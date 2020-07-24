import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Nav from "./Components/Nav/Nav";
import { setUser } from "./redux/reducer";
import routes from "./routes";

export default () => {
  const dispatch = useDispatch();

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

  return (
    <div className="app">
      <Nav />
      {routes}
    </div>
  );
};
