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
import {
  FaQuestionCircle,
} from 'react-icons/fa';
import SettingItem from './SettingItem';

const SettingsList = () => {
  return (
    <ListGroup className="bg-dark" style={{ gap: '8px' }}>
<div className="px-3 py-4">
<SettingItem
          icon={<Slack size={20} />}
          title="Account"
          subtitle="Security notifications, change email"
        />
      </div>
      <div className="px-3 py-4">
        <SettingItem
          icon={<GlobeLock size={20} />}
          title="Privacy"
          subtitle="Block users, disappearing messages"
        />
      </div>

      <div className="px-3 py-4">
        <SettingItem
          icon={<MessageCircleHeart size={20} />}
          title="Chats"
          subtitle="Theme, wallpapers, chat history"
        />
      </div>
      <div className="px-3 py-4">
        <SettingItem
          icon={<BellRing size={20} />}
          title="Notifications"
          subtitle="Message, group and call tones"
        />
      </div>
      <div className="px-3 py-4">
        <SettingItem
          icon={<Server size={20} />}
          title="Storage and data"
          subtitle="Network usage, auto-download"
        />
      </div>
      <div className="px-3 py-4">
        <SettingItem
          icon={<Languages size={20} />}
          title="App language"
          subtitle="English (device's language)"
        />
      </div>
      <div className="px-3 py-4">
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
