import React from 'react';
import { ChevronLeft, EllipsisVertical, Search } from 'lucide-react';

const Header = ({ goBack }) => {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        {/* Left - Back button */}
        <button onClick={goBack} className="back-button">
          <ChevronLeft size={24} />
        </button>

        {/* Middle - Title */}
        <h1 className="header-title">Starred Messages</h1>

        {/* Right - Icons */}
        <div className="header-icons">
          <Search size={20} />
          <EllipsisVertical size={20} />
        </div>
      </div>

      {/* Add styles directly here or globally */}
      <style>{`
        .header-wrapper {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: black;
          border-bottom: 1px solid #2d2d2d;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          color: white;
        }

        .back-button {
          margin-right: 8px;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
        }

        .header-title {
          flex-grow: 1;
          text-align: center;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .header-icons {
          display: flex;
          gap: 16px;
          color: #a1a1aa; /* Gray-400 equivalent */
        }
      `}</style>
    </div>
  );
};

export default Header;
