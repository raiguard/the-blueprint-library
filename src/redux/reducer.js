const initialState = {
  user: {}
};

const SET_USER = "SET_USER";
const CLEAR_USER = "CLEAR_USER";

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
    payload: {}
  };
}

export default (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case SET_USER:
      return { ...state, user: payload };
    case CLEAR_USER:
      return { ...state, user: payload };
    default:
      return state;
  }
};
