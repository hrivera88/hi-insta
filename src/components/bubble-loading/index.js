// import React from "react";
// eslint-disable-next-line
export default ({ type, loading }) => (
    
    <div className={`${type} bubble-group`} style ={{display: loading === false && 'none'}}>
    <div className="bubble">
      <img
        src="/images/three-dots.svg"
        width="30px"
        alt="visitor is typing"
        srcSet=""
      />
    </div>
  </div>
);
