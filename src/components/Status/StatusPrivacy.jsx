import React, { useState } from 'react';
import { ChevronLeft, User, ShieldBan, HandCoins } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatusPrivacy = ({
  handleBackClick,
  onOnlyShareWithClick,
  onContactsExceptClick,
}) => {
  const [selectedOption, setSelectedOption] = useState('contacts');

  const options = [
    {
      key: 'contacts',
      label: 'My contacts',
      icon: <User size={18} />,
    },
    {
      key: 'contactsExcept',
      label: 'My contacts except...',
      icon: <ShieldBan size={18} />,
      note: '0 excluded',
      onNoteClick: onContactsExceptClick,
    },
    {
      key: 'onlyShareWith',
      label: 'Only share with...',
      icon: <HandCoins size={18} />,
      note: '0 included',
      onNoteClick: onOnlyShareWithClick,
    },
  ];

  const getItemStyle = (optionKey) => ({
    backgroundColor: selectedOption === optionKey ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
    border: selectedOption === optionKey ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '1rem',
    padding: '1rem',
    marginBottom: '1rem',
  });

  const getIconColor = (optionKey) =>
    selectedOption === optionKey ? '#28a745' : 'rgba(255,255,255,0.6)';

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        padding: '1rem',
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center mb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '1rem' }}
      >
        <ChevronLeft
          onClick={handleBackClick}
          style={{
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            marginRight: '0.5rem',
          }}
        />
        <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>
          Status Privacy
        </h5>
      </div>

      {/* Body */}
      <div>
        <div className="mb-3 text-secondary" style={{ fontSize: '0.9rem' }}>
          Who can see my status updates
        </div>

        {options.map((option) => (
          <div
            key={option.key}
            className="d-flex align-items-center justify-content-between"
            style={getItemStyle(option.key)}
            onClick={() => setSelectedOption(option.key)}
          >
            <div className="d-flex align-items-center">
            <div
  className="d-flex justify-content-center align-items-center rounded-circle me-3"
  style={{
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '40px',
    height: '40px',
  }}
>
  {React.cloneElement(option.icon, {
    color: getIconColor(option.key),
  })}
</div>

              <div className="fw-medium">{option.label}</div>
            </div>

            {/* Note Click Handler (Triggers Parent) */}
            {option.note && (
              <div
                className="text-success small"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`"${option.label}" clicked — Note: ${option.note}`);
                  if (option.onNoteClick) {
                    option.onNoteClick(); // ✅ Trigger the appropriate callback
                  }
                }}
              >
                {option.note}
              </div>
            )}
          </div>
        ))}

        {/* Footer Note */}
        <div
          className="text-secondary small pt-2 pb-5"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            lineHeight: '1.4',
          }}
        >
          Changes to your privacy settings won't affect status updates that you've sent already.
        </div>
      </div>
    </div>
  );
};

export default StatusPrivacy;
