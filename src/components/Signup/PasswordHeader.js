import React from "react";
import { Container } from "react-bootstrap";

const PasswordHeader = () => {
  return (
    <Container className="text-start">
      <h3 className="fw-bold mb-2" style={{ marginTop: "-40px" }}>
        Set Password
      </h3>
      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Choose a strong and secure password.
      </p>
    </Container>
  );
};

export default PasswordHeader;
