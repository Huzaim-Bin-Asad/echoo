import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Row, Col, Form } from 'react-bootstrap';

const NetworkUsage = () => (
  <div className="py-3 border-top border-secondary">
    <Row className="mb-2">
      <Col xs="auto">
        <RefreshCcw size={20} />
      </Col>
      <Col>
        <div>Network usage</div>
        <small className="text-muted">376.4 MB sent · 71.8 MB received</small>
      </Col>
    </Row>
    <Row className="mb-2">
      <Col>Use less data for calls</Col>
      <Col xs="auto">
        <Form.Check type="switch" id="dataToggle" />
      </Col>
    </Row>
    <Row>
      <Col>Proxy</Col>
      <Col xs="auto">
        <span className="text-muted">Off</span>
      </Col>
    </Row>
  </div>
);

export default NetworkUsage;
