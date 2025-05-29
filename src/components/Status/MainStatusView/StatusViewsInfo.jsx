// viewer/StatusViewsInfo.jsx
import { Eye } from "lucide-react";

const StatusViewsInfo = ({ onEyeClick }) => (
  <div
    className="d-flex flex-column align-items-start justify-content-center py-3 ps-3 cursor-pointer"
    onClick={onEyeClick}
  >
    <Eye size={24} className="ms-2" />
    <div className="mt-2">Views</div>
  </div>
);

export default StatusViewsInfo;
