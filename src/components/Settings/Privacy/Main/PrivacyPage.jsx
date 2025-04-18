import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import ViewInfo from './ViewInfo';
import DisappearingMessages from './DisappearingMessages';
import GeneralSettings from './GeneralSettings';

const PrivacyPage = ({ goBack }) => {
  return (
    <div className="container py-4 text-light bg-dark" style={{ minHeight: '100vh' }}>
      <Header goBack={goBack} /> {/* Pass goBack here */}
      <ViewInfo />
      <DisappearingMessages />
      <GeneralSettings />
    </div>
  );
};

export default PrivacyPage;
