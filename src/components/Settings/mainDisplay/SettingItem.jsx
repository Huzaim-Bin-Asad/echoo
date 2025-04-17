import React from 'react';
import { BsChevronRight } from 'react-icons/bs';

const SettingItem = ({ icon, title, subtitle }) => {
  return (
    <div className="d-flex align-items-center justify-content-between bg-dark text-white rounded-2">
      <div className="d-flex align-items-start gap-3">
        <div className="fs-4">{icon}</div>
        <div>
          <div className="fw-semibold">{title}</div>
          {subtitle && <div className="text-white small">{subtitle}</div>}
        </div>
      </div>
      <BsChevronRight className="text-muted" />
    </div>
  );
};

export default SettingItem;
