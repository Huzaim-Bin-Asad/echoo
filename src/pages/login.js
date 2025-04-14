// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Undo2, ChevronRight } from "lucide-react";

import LoginHeader from "../components/Login/LoginHeader";
import LoginInputFields from "../components/Login/LoginInputFields";
import ErrorCard from "../components/response/error";
import { loginUser } from "../services/LoginApi"; // Import the API function

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { token, user } = await loginUser(credentials);
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to dashboard or home
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (error) {
    return <ErrorCard 
      message={error} 
      onRetry={() => setError(null)} 
    />;
  }

  return (
    <div className="d-flex flex-column align-items-start justify-content-between vh-100 px-4 py-3 bg-white">
      {/* Back Icon */}
      <div className="w-100 d-flex align-items-start">
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Undo2 size={28} />
        </div>
      </div>

      {/* Content */}
      <Container className="text-start">
        <LoginHeader />
        <LoginInputFields 
          credentials={credentials} 
          onChange={handleChange} 
        />

        {/* Login Button */}
        <Button
          className="w-100 rounded-4 fw-semibold shadow bg-black border-none"
          style={{ height: "45px" }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {/* New to Echoo? */}
        <div className="mt-4 text-start">
          <span className="d-block">New to Echoo?</span>
          <div
            className="d-flex align-items-center text-danger fw-bold cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            SIGN UP <ChevronRight size={18} className="ms-1" />
          </div>
        </div>
      </Container>

      {/* Bottom Spacer */}
      <div></div>
    </div>
  );
};

export default Login;