import React from "react";
import { Form } from "react-bootstrap";

const NameInputFields = () => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formFirstName">
        <Form.Control
          type="text"
          placeholder="First name"
          className="rounded-4 px-3 text-start border shadow-sm"
          style={{ height: "45px" }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formLastName">
        <Form.Control
          type="text"
          placeholder="Last name"
          className="rounded-4 px-3 text-start border shadow-sm"
          style={{ height: "45px" }}
        />
      </Form.Group>
    </Form>
  );
};

export default NameInputFields;