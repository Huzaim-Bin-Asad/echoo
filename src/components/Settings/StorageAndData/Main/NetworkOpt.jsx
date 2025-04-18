import React from 'react';
import { Row, Col } from 'react-bootstrap';

const NetworkOpt = () => (
  <div className="py-3 border-top border-secondary">
    <Row>
      <Col>
        <small className="text-muted">Media auto-download</small>
        <div className="text-muted">Voice messages are always automatically downloaded</div>
      </Col>
    </Row>
    <Row className="mt-3">
      <Col>
        <div>When using mobile data</div>
        <small className="text-muted">Photos</small>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <div>When connected on Wi-Fi</div>
        <small className="text-muted">All media</small>
      </Col>
    </Row>
    <Row className="mt-2">
      <Col>
        <div>When roaming</div>
        <small className="text-muted">No media</small>
      </Col>
    </Row>
  </div>
);

export default NetworkOpt;
