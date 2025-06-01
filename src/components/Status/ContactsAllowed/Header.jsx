import React from "react";
import { ChevronLeft, ListCheck, Search } from "lucide-react";

const Header = ({ selectedCount, totalCount, handleBackClick, onSelectAll }) => {
  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
      <div className="d-flex align-items-center">
        <ChevronLeft
          size={24}
          onClick={handleBackClick}
          role="button"
          tabIndex={0}
          aria-label="Go back"
          style={{ cursor: "pointer" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBackClick();
            }
          }}
        />
        <div className="ms-3">
          <div className="fw-bold">Share status with...</div>
          <div className="small ">
            {selectedCount === 0
              ? "No contacts selected"
              : `${selectedCount} of ${totalCount} selected`}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <Search size={20} className="me-3" role="button" />
        <ListCheck
          size={20}
          onClick={onSelectAll}
          role="button"
          tabIndex={0}
          aria-label="Select all contacts"
          style={{ cursor: "pointer" }}
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
