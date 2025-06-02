import React from "react";
import { ChevronLeft, ListCheck, Search } from "lucide-react";

const Header = ({ selectedCount, totalCount, handleBackClick, onSelectAll }) => {
  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white shadow-sm">
      {/* Left Section */}
      <div className="d-flex align-items-center">
        <ChevronLeft
          size={24}
          onClick={handleBackClick}
          role="button"
          tabIndex={0}
          aria-label="Go back"
          className="text-primary cursor-pointer"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBackClick();
            }
          }}
        />
        <div className="ms-3">
          <div className="fw-semibold fs-6 text-dark">Share status with...</div>
          <div className="text-muted small">
            {selectedCount === 0
              ? "No contacts selected"
              : `${selectedCount} of ${totalCount} selected`}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="d-flex align-items-center">
        <Search
          size={20}
          className="me-3 text-secondary cursor-pointer"
          role="button"
        />
        <ListCheck
          size={20}
          onClick={onSelectAll}
          role="button"
          tabIndex={0}
          aria-label="Select all contacts"
          className="text-secondary cursor-pointer"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectAll();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Header;
