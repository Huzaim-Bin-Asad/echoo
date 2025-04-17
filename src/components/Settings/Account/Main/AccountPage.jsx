import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Header from './Header';
import SettingsLayout from './SettingsLayout';

const AccountPage = () => {
  return (
    <Container className="py-4">
      <Header title="Account" />
      <SettingsLayout />
    </Container>
  );
};

export default AccountPage;
