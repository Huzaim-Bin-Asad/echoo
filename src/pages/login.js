// src/pages/Login.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Undo2, ChevronRight } from "lucide-react";

import LoginHeader from "../components/Login/LoginHeader";
import LoginInputFields from "../components/Login/LoginInputFields";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column align-items-start justify-content-between vh-100 px-4 py-3"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Back Icon */}
      <div className="w-100 d-flex align-items-start">
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Undo2 size={28} />
        </div>
      </div>

      {/* Content */}
      <Container className="text-start">
        <LoginHeader />
        <LoginInputFields />

        {/* Login Button */}
        <Button
          className="w-100 rounded-4 fw-semibold shadow"
          style={{ backgroundColor: "black", border: "none", height: "45px" }}
        >
          Login
        </Button>

        {/* New to Echoo? */}
        <div className="mt-4 text-start">
          <span className="d-block">New to Echoo?</span>
          <div
            className="d-flex align-items-center text-danger fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            SIGN UP <ChevronRight size={18} className="ms-1" />
          </div>
        </div>
      </Container>

      {/* Bottom Spacer */}
      <div></div>
    </div>
  );
};

export default Login;
