import React from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { Row, Col } from 'react-bootstrap';

const Header = ({ goBack }) => {
  return (
    <Row className="align-items-center mb-3">
      <Col xs="auto">
        <ChevronLeft size={24} style={{ cursor: 'pointer' }} onClick={goBack} />
      </Col>
      <Col>
        <h5 className="mb-0">Storage and data</h5>
      </Col>
      <Col xs="auto">
        <MoreVertical size={20} />
      </Col>
    </Row>
  );
};

export default Header;
