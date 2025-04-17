import React from 'react';
import Option from './Option';
import {
  ShieldLock,
  People,
  Envelope,
  Key,
  Link,
  Stars,
  Telephone,
  FileText,
  Trash
} from 'react-bootstrap-icons';

const options = [
  { icon: <ShieldLock />, label: 'Security notifications' },
  { icon: <People />, label: 'Passkeys' },
  { icon: <Envelope />, label: 'Email address' },
  { icon: <Key />, label: 'Two-step verification' },
  { icon: <Link />, label: 'Business Platform' },
  { icon: <Stars />, label: 'Connect to AI' },
  { icon: <Telephone />, label: 'Change number' },
  { icon: <FileText />, label: 'Request account info' },
  { icon: <Trash />, label: 'Delete account' },
];

const SettingsLayout = () => {
  return (
    <div className="list-group">
      {options.map((item, index) => (
        <Option key={index} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
};

export default SettingsLayout;
