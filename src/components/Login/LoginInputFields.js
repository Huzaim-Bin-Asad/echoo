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
  >
    <path d="m15 18-.722-3.25" />
    <path d="M2 8a10.645 10.645 0 0 0 20 0" />
    <path d="m20 15-1.726-2.05" />
    <path d="m4 15 1.726-2.05" />
    <path d="m9 18 .722-3.25" />
  </svg>
);

const LoginInputFields = ({ credentials, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form>
      {/* Email or Username Field */}
      <Form.Group className="mb-3" controlId="formIdentifier">
        <InputGroup hasValidation>
          <Form.Control
            name="identifier"
            type="text"
            placeholder="Email or Username"
            className={`rounded-start-4 px-3 text-start border shadow-sm ${
              errors.identifier ? "is-invalid" : ""
            }`}
            style={{ height: "45px" }}
            value={credentials.identifier}
            onChange={onChange}
            isInvalid={!!errors.identifier}
          />
          <InputGroup.Text
            className={`bg-white border shadow-sm rounded-end-4 ${
              errors.identifier ? "border-danger" : ""
            }`}
            style={{ height: "45px" }}
          >
            <AtSign size={18} />
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid" className="text-start">
            {errors.identifier}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      {/* Password Field */}
      <Form.Group className="mb-1" controlId="formPassword">
        <InputGroup hasValidation>
          <Form.Control
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`rounded-start-4 px-3 text-start border shadow-sm ${
              errors.password ? "is-invalid" : ""
            }`}
            style={{ height: "45px" }}
            value={credentials.password}
            onChange={onChange}
            isInvalid={!!errors.password}
          />
          <InputGroup.Text
            className={`bg-white border shadow-sm rounded-end-4 cursor-pointer ${
              errors.password ? "border-danger" : ""
            }`}
            style={{ height: "45px" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={18} /> : <EyeClosedIcon />}
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid" className="text-start">
            {errors.password}
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </Form>
  );
};

export default LoginInputFields;