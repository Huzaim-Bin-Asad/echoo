import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useTokenChecker = (currentPath) => {
  const [tokenMissing, setTokenMissing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLandingOrAuthPage = 
      currentPath === '/' || 
      currentPath === '/login' || 
      currentPath === '/signup';

    const token = localStorage.getItem('token');
    const tokenSavedAt = localStorage.getItem('token_saved_at');

    if (token && tokenSavedAt) {
      const savedAt = new Date(tokenSavedAt);
      const currentTime = new Date();
      const timeDifference = (currentTime - savedAt) / 1000;

      if (timeDifference < 86400) {
        setTokenMissing(false);
        setShowModal(false);

        // ✅ Redirect only if user is on landing/auth pages
        if (isLandingOrAuthPage) {
          navigate('/echoo');
        }

        return;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('token_saved_at');
      }
    }

    // If token is missing or expired
    setTokenMissing(true);
    setShowModal(true);
  }, [currentPath, navigate]);

  const AuthModal = ({ handleLogin, handleSignup }) => {
    if (!showModal) return null;

    return (
      <div className="modal fade show d-block" style={{ background: 'rgba(0, 0, 0, 0.6)' }} id="authModal" role="dialog">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '360px', margin: 'auto' }}>
          <div className="modal-content bg-dark text-white rounded-4 shadow-lg" style={{ height: '360px' }}>
            <div className="modal-body d-flex flex-column justify-content-center align-items-center text-center p-4" style={{ height: '100%' }}>
              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Welcome back</h5>
                <p className="small text-white-50 mb-0">
                  Log in or sign up to continue chatting, sync your messages, and stay connected.
                </p>
              </div>
              <div className="d-flex flex-column align-items-center gap-3 w-100">
                <button 
                  className="btn btn-light" 
                  style={{ width: '60%', borderRadius: '999px', padding: '10px 0' }} 
                  onClick={handleLogin}
                >
                  Log in
                </button>
                <button 
                  className="btn btn-outline-light" 
                  style={{ width: '60%', borderRadius: '999px', padding: '10px 0' }} 
                  onClick={handleSignup}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return { AuthModal, tokenMissing };
};

export default useTokenChecker;
