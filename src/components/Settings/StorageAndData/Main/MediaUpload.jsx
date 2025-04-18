import React from 'react';
import { HdmiPort } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';

const MediaUpload = () => (
  <Row className="py-3 border-top border-secondary">
    <Col xs="auto">
      <HdmiPort size={20} />
    </Col>
    <Col>
      <div>Media upload quality</div>
      <small className="text-muted">HD quality</small>
    </Col>
  </Row>
);

export default MediaUpload;
