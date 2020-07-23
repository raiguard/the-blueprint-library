import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/reducer";

export default () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  return (
    <nav>
      <p>{userData.username}</p>
    </nav>
  );
};
