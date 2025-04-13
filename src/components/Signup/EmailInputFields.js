import React from "react";
import { Form } from "react-bootstrap";
import { AtSign } from "lucide-react";

const EmailInputFields = ({ formData, updateFormData }) => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formEmail">
        <div className="position-relative">
          <Form.Control
            type="email"
            placeholder="Email address"
            className="rounded-4 ps-3 pe-5 text-start border shadow-sm"
            style={{ 
              height: "45px",
              backgroundImage: 'none'
            }}
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
          />
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            <AtSign size={18} className="text-secondary" />
          </div>
        </div>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="formUsername">
        <div className="position-relative">
          <Form.Control
            type="text"
            placeholder="Username"
            className="rounded-4 ps-3 pe-5 text-start border shadow-sm"
            style={{ 
              height: "45px",
              backgroundImage: 'none'
            }}
            value={formData.username}
            onChange={(e) => updateFormData('username', e.target.value)}
            required
          />
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            <AtSign size={18} className="text-secondary" />
          </div>
        </div>
      </Form.Group>
    </Form>
  );
};

export default EmailInputFields;