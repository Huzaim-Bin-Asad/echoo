import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";

const PasswordInputFields = ({ formData, updateFormData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form>
      <Form.Group className="mb-3" controlId="formPassword">
        <div className="position-relative">
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="rounded-4 ps-3 pe-5 text-start border shadow-sm"
            style={{ height: "45px" }}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            required
            minLength={8}
          />
          <div 
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} className="text-secondary" /> : <Eye size={18} className="text-secondary" />}
          </div>
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <div className="position-relative">
          <Form.Control
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="rounded-4 ps-3 pe-5 text-start border shadow-sm"
            style={{ height: "45px" }}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            required
            minLength={8}
          />
          <div 
            className="position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} className="text-secondary" /> : <Eye size={18} className="text-secondary" />}
          </div>
        </div>
      </Form.Group>
    </Form>
  );
};

export default PasswordInputFields;