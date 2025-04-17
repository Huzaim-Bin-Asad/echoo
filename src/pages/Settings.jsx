import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import SettingsHeader from '../components/Settings/mainDisplay/SettingsHeader';
import ProfileSetting from '../components/Settings/mainDisplay/ProfileSetting';
import SettingsList from '../components/Settings/mainDisplay/SettingsList';
import AccountPage from '../components/Settings/Account/Main/AccountPage';

const Settings = () => {
  const [activePage, setActivePage] = useState('main'); // 'main' or 'account'

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  return (
    <>
      {activePage === 'main' && <SettingsHeader />}  {/* Only show SettingsHeader on main page */}
      <Container className="py-4 bg-dark min-vh-100 text-white">
        {activePage === 'main' && (
          <>
            <ProfileSetting />
            <SettingsList onNavigate={handleNavigate} />
          </>
        )}
        {activePage === 'account' && <AccountPage />}
      </Container>
    </>
  );
};

export default Settings;
