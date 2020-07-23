import React from "react";
import "./App.css";
import routes from "./routes";

import Nav from "./Components/Nav/Nav";

export default () => {
  return (
    <div className="app">
      <Nav />
      {routes}
    </div>
  );
};
