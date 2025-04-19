import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Header';
import ViewInfo from './ViewInfo';
import DisappearingMessages from './DisappearingMessages';
import GeneralSettings from './GeneralSettings';

const PrivacyPage = ({ goBack }) => {
  return (
    <div
      className="bg-dark text-light"
      style={{
        minHeight: '100vh',
        overflowY: 'auto', // This makes the sticky header work
        padding: '1rem',
      }}
    >
      <Header goBack={goBack} />
      <ViewInfo />
      <DisappearingMessages />
      <GeneralSettings />
    </div>
  );
};

export default PrivacyPage;
