import React from "react";

import "./Loader.css";

export const Loader: React.FC = () => {
  return (
    <div className="loader-circular-container">
      <div className="loader-circular"></div>
    </div>
  );
};

export default Loader;
