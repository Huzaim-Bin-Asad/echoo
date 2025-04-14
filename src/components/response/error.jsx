import React from 'react';
import { Frown } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ErrorCard = ({ onRetry }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-body-tertiary">
      <div
        className="bg-danger text-white rounded-4 p-4 text-center shadow-lg position-relative"
        style={{ width: '280px', height: '280px' }}
      >
        <div className="mb-4">
          <Frown size={72} strokeWidth={1.8} />
        </div>
        <h4 className="fw-semibold mb-4">OOPS</h4>
        <button
          onClick={onRetry}
          className="btn btn-light text-danger fw-semibold rounded-pill px-4 py-2 position-absolute start-50 translate-middle-x"
          style={{ bottom: '20px' }}
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
};

export default ErrorCard;
