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
    <ListGroup className="bg-dark" style={{ gap: '22px', marginRight: '1rem' }}>
      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
        <SettingItem
          icon={<Slack size={20} />}
          title="Account"
          subtitle="Security notifications, change email"
          onClick={() => onNavigate('account')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '.1rem' }}>
        <SettingItem
          icon={<GlobeLock size={20} />}
          title="Privacy"
          subtitle="Block users, disappearing messages"
          onClick={() => onNavigate('privacy')}
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
        <SettingItem
          icon={<MessageCircleHeart size={20} />}
          title="Chats"
          subtitle="Theme, wallpapers, chat history"
          onClick={() => onNavigate('chats')}
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
        <SettingItem
          icon={<BellRing size={20} />}
          title="Notifications"
          subtitle="Message, group and call tones"
          onClick={() => onNavigate('notifications')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
        <SettingItem
          icon={<Server size={20} />}
          title="Storage and data"
          subtitle="Network usage, auto-download"
          onClick={() => onNavigate('storage')}
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
        <SettingItem
          icon={<Languages size={20} />}
          title="App language"
          subtitle="English (device's language)"
        />
      </div>

      <div className="py-2" style={{ paddingRight: '25px', marginRight: '1rem', marginBottom: '1rem' }}>
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
