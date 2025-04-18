import React from 'react';
import Header from './Header';
import SettingsLayout from './SettingsLayout';
import './AccountPage.css'; // Import the custom CSS file

const AccountPage = ({ goBack }) => {
  return (
    <div className="account-page-wrapper"> {/* Apply the custom wrapper class */}
      <div className="w-full max-w-[768px] flex flex-col px-6 py-8 flex-grow">
        <Header title="Account" onBack={goBack} className="header-padding" />
        
        <div className="account-page-content">
          <SettingsLayout />
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
