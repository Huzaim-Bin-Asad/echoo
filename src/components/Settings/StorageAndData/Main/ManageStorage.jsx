import React from 'react';
import { Folder } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';

const ManageStorage = () => (
  <Row className="py-3 border-top border-secondary">
    <Col xs="auto">
      <Folder size={20} />
    </Col>
    <Col>
      <div>Manage storage</div>
      <small className="text-muted">8.1 GB</small>
    </Col>
  </Row>
);

export default ManageStorage;
