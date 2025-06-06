// GroupMetaData/GroupHeader.jsx
import { ChevronLeft } from "lucide-react";

export default function GroupHeader() {
  return (
    <div
      className="d-flex align-items-center"
      style={{
        backgroundColor: "#9980e3a9", // light mauve background
        color: "white",
        borderBottom: "1px solid white",
        padding: "0 1rem",
        height: "60px",
        minHeight: "60px",
        maxHeight: "60px",
        flexShrink: 0,
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 999,
      }}
    >
      <button
        className="btn btn-link text-white p-0 me-3"
        onClick={() => window.history.back()}
        style={{ textDecoration: "none" }}
      >
        <ChevronLeft size={24} />
      </button>
      <h5 className="mb-0 fw-semibold" style={{ fontSize: "1.05rem" }}>
        New group
      </h5>
    </div>
  );
}
