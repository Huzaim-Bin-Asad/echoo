import React, { useState } from 'react';
import SettingsHeader from '../components/Settings/mainDisplay/SettingsHeader';
import ProfileSetting from '../components/Settings/mainDisplay/ProfileSetting';
import SettingsList from '../components/Settings/mainDisplay/SettingsList';
import AccountPage from '../components/Settings/Account/Main/AccountPage';
import PrivacyPage from  '../components/Settings/Privacy/Main/PrivacyPage'
const Settings = () => {
  const [activeView, setActiveView] = useState('main');

  const goTo = (view) => setActiveView(view);
  const goBack = () => setActiveView('main');

  return (
    <div className="min-h-screen bg-dark text-white flex justify-center">
      <div className="w-full max-w-[768px] border border-secondary flex flex-col min-h-screen">
        {activeView === 'main' && (
          <>
            <SettingsHeader />
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ProfileSetting />
              <SettingsList onNavigate={goTo} />
            </div>
          </>
        )}

        {activeView === 'account' && (
          <div className="flex-1 overflow-y-auto">
            <AccountPage goBack={goBack} />
          </div>
        )}

{activeView === 'privacy' && (
  <div className="flex-1 overflow-y-auto">
    <PrivacyPage goBack={goBack} />
  </div>
)}

      </div>
    </div>
  );
};

export default Settings;
