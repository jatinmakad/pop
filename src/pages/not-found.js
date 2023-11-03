import React from "react";
import { Container } from "react-bootstrap";

const notFound = () => {
  return (
    <div className="w-100 vh-md-100 py-5 px-3 d-flex justify-content-center align-items-center">
        <Container>
      {/* <p style={{ fontSize: "30px", fontWeight: "700" }}>
        404{" "}
        <span style={{ fontWeight: "400" }}>| This page is not accessible</span>
      </p> */}
     <div className="text-center"> <img src={'../images/404_mada.png'}/></div>
    
      </Container>
    </div>
  );
};

export default notFound;
