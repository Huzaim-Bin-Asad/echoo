// src/components/Login/LoginInputFields.js
import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { AtSign, Eye } from "lucide-react";

const EyeClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-eye-closed"
  >
    <path d="m15 18-.722-3.25" />
    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
    <path d="m20 15-1.726-2.05" />
    <path d="m4 15 1.726-2.05" />
    <path d="m9 18 .722-3.25" />
  </svg>
);

const LoginInputFields = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form>
      {/* Email or Username Field */}
      <Form.Group className="mb-3" controlId="formEmail">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Email or Username"
            className="rounded-start-4 px-3 text-start border shadow-sm"
            style={{ height: "45px" }}
          />
          <InputGroup.Text
            className="bg-white border shadow-sm rounded-end-4"
            style={{ height: "45px" }}
          >
            <AtSign size={18} />
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>

      {/* Password Field */}
      <Form.Group className="mb-3" controlId="formPassword">
        <InputGroup>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="rounded-start-4 px-3 text-start border shadow-sm"
            style={{ height: "45px" }}
          />
          <InputGroup.Text
            className="bg-white border shadow-sm rounded-end-4"
            style={{ height: "45px", cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={18} /> : <EyeClosedIcon />}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};

export default LoginInputFields;
