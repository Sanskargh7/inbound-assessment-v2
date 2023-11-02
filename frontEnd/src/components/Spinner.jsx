import React from "react";

const Spinner = () => {

  return (
    <div className="spinner_outer">
      <div className="spinner-border text-warning " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
