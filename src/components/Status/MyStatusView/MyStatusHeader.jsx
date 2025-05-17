import { ChevronLeft } from 'lucide-react';

export default function MyStatusHeader({ onBack }) {
  return (
    <div
      className="d-flex align-items-center px-3 py-2 border-bottom shadow-sm"
      style={{ backgroundColor: '#ffffff', width: '100%' }} // light background
    >
      <div
        onClick={onBack}
        className="d-flex align-items-center cursor-pointer flex-shrink-0"
        style={{ gap: '8px', color: '#222222' }} // dark text color for light bg
      >
        <ChevronLeft size={26} strokeWidth={2.5} color="#222222" />
        <h2
          className="mb-0 fw-semibold text-truncate"
          style={{ fontSize: '1.4rem', whiteSpace: 'nowrap', color: '#222222' }}
        >
          My Status
        </h2>
      </div>
    </div>
  );
}
