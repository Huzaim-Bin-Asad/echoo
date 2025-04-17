import React from 'react';
import { Container } from 'react-bootstrap';
import SettingsHeader from '../components/Settings/mainDisplay/SettingsHeader';
import ProfileSetting from '../components/Settings/mainDisplay/ProfileSetting';
import SettingsList from '../components/Settings/mainDisplay/SettingsList';

const Settings = () => {
  return (
    <>
      <SettingsHeader />
      <Container className="py-4 bg-dark min-vh-100 text-white">
        <ProfileSetting />         {/* ✅ Moved into its own component */}
        <SettingsList />          {/* ✅ Already modular */}
      </Container>
    </>
  );
};

export default Settings;
