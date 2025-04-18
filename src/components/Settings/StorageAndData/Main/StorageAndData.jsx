import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import ManageStorage from './ManageStorage';
import NetworkUsage from './NetworkUsage';
import MediaUpload from './MediaUpload';
import NetworkOpt from './NetworkOpt';

const StorageAndData = ({ goBack }) => {
  return (
    <Container fluid className="bg-dark text-white min-vh-100 p-3">
      <Header goBack={goBack} />
      <ManageStorage />
      <NetworkUsage />
      <MediaUpload />
      <NetworkOpt />
    </Container>
  );
};

export default StorageAndData;
