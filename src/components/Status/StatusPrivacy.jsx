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

  const mauve = {
    background: '#F5F0F6',
    card: '#FFFFFF',
    primary: '#B784B7',
    border: '#E0CFE2',
    noteText: '#9D76C1',
    iconInactive: '#AAA',
    text: '#333',
  };

  const getItemStyle = (optionKey) => ({
    backgroundColor: selectedOption === optionKey ? `${mauve.primary}20` : mauve.card,
    border: selectedOption === optionKey ? `1px solid ${mauve.primary}70` : `1px solid ${mauve.border}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '1rem',
    padding: '1rem',
    marginBottom: '1rem',
    color: mauve.text,
  });

  const getIconColor = (optionKey) =>
    selectedOption === optionKey ? mauve.primary : mauve.iconInactive;

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: mauve.background,
        minHeight: '100vh',
        color: mauve.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        padding: '1rem',
      }}
    >
      {/* Header */}
      <div
        className="d-flex align-items-center mb-4"
        style={{
          borderBottom: `1px solid ${mauve.border}`,
          paddingBottom: '1rem',
        }}
      >
        <ChevronLeft
          onClick={handleBackClick}
          style={{
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            marginRight: '0.5rem',
            color: mauve.primary,
          }}
        />
        <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>
          Status Privacy
        </h5>
      </div>

      {/* Body */}
      <div>
        <div className="mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
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
                  backgroundColor: `${mauve.primary}10`,
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

            {option.note && (
              <div
                className="small"
                style={{ color: mauve.noteText }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (option.onNoteClick) option.onNoteClick();
                }}
              >
                {option.note}
              </div>
            )}
          </div>
        ))}

        {/* Footer Note */}
        <div
          className="text-muted small pt-2 pb-5"
          style={{
            color: '#7C6A8B',
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
