// src/components/Login/LoginHeader.js
import React from "react";
import { Container } from "react-bootstrap";

const LoginHeader = () => {
  return (
    <Container className="text-start">
      <h3 className="fw-bold mb-2" style={{ marginTop: "-40px" }}>
        Welcome Back!
      </h3>
      <p className="text-muted mb-4" style={{ fontSize: "0.875rem" }}>
        Enter your details to access your account
      </p>
    </Container>
  );
};

export default LoginHeader;
