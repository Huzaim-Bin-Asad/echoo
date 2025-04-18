import React from 'react';
import { ListGroup } from 'react-bootstrap';
import {
  Slack,
  GlobeLock,
  MessageCircleHeart,
  BellRing,
  Server,
  Languages,
} from 'lucide-react';
import { FaQuestionCircle } from 'react-icons/fa';
import SettingItem from './SettingItem';

const SettingsList = ({ onNavigate }) => {
  return (
    <ListGroup className="bg-dark" style={{ gap: '8px' }}>
<div className="py-4" style={{ paddingRight: '25px' }}>
<SettingItem
          icon={<Slack size={20} />}
          title="Account"
          subtitle="Security notifications, change email"
          onClick={() => onNavigate('account')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
           icon={<GlobeLock size={20} />}
           title="Privacy"
           subtitle="Block users, disappearing messages"
           onClick={() => onNavigate('privacy')} // 👈 Here!
         
        />
      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
  icon={<MessageCircleHeart size={20} />}
  title="Chats"
  subtitle="Theme, wallpapers, chat history"
  onClick={() => onNavigate('chats')} // ✅ Navigate to Chats
/>

      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
  icon={<BellRing size={20} />}
  title="Notifications"
  subtitle="Message, group and call tones"
  onClick={() => onNavigate('notifications')} // ✅ Add navigation
  style={{ cursor: 'pointer' }}
/>

      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
  icon={<Server size={20} />}
  title="Storage and data"
  subtitle="Network usage, auto-download"
  onClick={() => onNavigate('storage')} // ✅ Add this
  style={{ cursor: 'pointer' }}
/>

      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
          icon={<Languages size={20} />}
          title="App language"
          subtitle="English (device's language)"
        />
      </div>

      <div className="py-4" style={{ paddingRight: '25px' }}>
      <SettingItem
          icon={<FaQuestionCircle size={18} />}
          title="Help"
          subtitle="Help centre, contact us, privacy policy"
        />
      </div>
    </ListGroup>
  );
};

export default SettingsList;
