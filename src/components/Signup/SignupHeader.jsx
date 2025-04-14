import React from "react";
import { Container } from "react-bootstrap";

const SignupHeader = () => {
  return (
    <Container className="text-start">
      <h3 className="fw-bold mb-2" style={{ marginTop: "-40px" }}>
        Sign up
      </h3>
      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Require information to account creations
      </p>
    </Container>
  );
};

export default SignupHeader;