import React from "react";
import { ChevronLeft, Search, ListCheck } from "lucide-react";

const Header = ({ selectedCount, onSelectAll, onBackClick }) => (
  <div className="d-flex justify-content-between align-items-center mb-3">
    <div className="d-flex align-items-center">
      <ChevronLeft
        className="me-2"
        role="button"
        onClick={onBackClick} // 👈 Trigger back function
      />
      <h5 className="mb-0">Hide status from...</h5>
    </div>
    <div className="d-flex align-items-center">
      <Search className="me-3" role="button" />
      <ListCheck role="button" onClick={onSelectAll} />
    </div>
  </div>
);

export default Header;
