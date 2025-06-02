import React from "react";
import { ChevronLeft, Search, ListCheck } from "lucide-react";

const Header = ({ selectedCount, onSelectAll, onBackClick }) => (
  <div
    className="d-flex justify-content-between align-items-center mb-3"
    style={{
      position: "sticky",
      top: 0,
      backgroundColor: "white",
      borderBottom: "1px solid #dee2e6",
      paddingBottom: ".5rem",
      zIndex: 1000,
      height: "60px",
      paddingTop: "0rem",
    }}
  >
    <div className="d-flex align-items-center" style={{ height: "100%" }}>
      <ChevronLeft
        className="me-2"
        role="button"
        onClick={onBackClick}
        style={{ position: "relative", top: "1px" }} // moves icon down 4px
      />
      <div className="d-flex flex-column">
        <h5 className="mb-0">Hide status from...</h5>
        <small className="text-muted">
          {selectedCount === 0
            ? "No contacts excluded"
            : `${selectedCount} contact${selectedCount > 1 ? "s" : ""} excluded`}
        </small>
      </div>
    </div>

    <div className="d-flex align-items-center" style={{ height: "100%" }}>
      <Search className="me-3" role="button" />
      <ListCheck role="button" onClick={onSelectAll} />
    </div>
  </div>
);

export default Header;
