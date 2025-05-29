import { Trash2, RedoDot } from "lucide-react";

const Header = ({ count, onClick }) => (
  <div
    className="d-flex justify-content-between align-items-center px-4 py-3 text-white"
style={{
  cursor: "pointer",
  minHeight: "50px",
  borderTopLeftRadius: "4px",
  borderTopRightRadius: "4px",
  borderBottomLeftRadius: "0",
  borderBottomRightRadius: "0",
  backgroundColor: "#1e1e1e",
  width: "108%",
  marginLeft: "-15px",
  zIndex: 1000,
  position: "relative",
}}

    onClick={onClick}
  >
    <div className="small fw-medium">Viewed by {count}</div>
    <div className="d-flex gap-3">
      <Trash2 size={18} className="text-secondary" />
      <RedoDot size={18} className="text-secondary" />
    </div>
  </div>
);

export default Header;
