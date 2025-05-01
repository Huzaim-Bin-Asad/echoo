import React, { useEffect, useRef } from 'react';
import { useUser } from '../../../services/UserContext';
import { useNavigate } from 'react-router-dom';
import ChatList from './ChatList';

const UserInfoPrinter = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const printCount = useRef(0);

  useEffect(() => {
    if (user && !loading) {
      printCount.current += 1;
      if (printCount.current % 10 === 0) {
        console.log('Checked user data');
      }
    }
  }, [user, loading]);

  const chatPreview = user ? user.chat_previews : null;

  return (
    <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: 'transparent' }}>
      {!chatPreview || chatPreview.length === 0 ? (
        <div
          className="p-3 mt-4 text-muted"
          style={{ fontSize: '0.9rem', backgroundColor: 'transparent' }}
        >
          <h6 className="mb-2">🕊️ Welcome to Echoo</h6>
          <p className="mb-1">It’s a little quiet here... you haven’t echoed any thoughts yet.</p>
          <p style={{ fontSize: '0.85rem' }}>
            <span
              onClick={() => navigate('/new-contact')}
              style={{
                color: 'inherit',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              Start your first convo
            </span>{" "}
            and let Echoo carry your words 🎈
          </p>
        </div>
      ) : (
        <ChatList visible={true} />
      )}
    </div>
  );
};

export default UserInfoPrinter;
