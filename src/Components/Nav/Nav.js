import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/reducer";

export default () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div>
      {console.log(userData)}
      <p>{userData.username}</p>
      <button onClick={() => dispatch(setUser({ username: "Fufucuddlypoops" }))} />
    </div>
  );
};
