import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import { Undo2, ChevronRight } from "lucide-react";

import LoginHeader from "../components/Login/LoginHeader";
import LoginInputFields from "../components/Login/LoginInputFields";
import { loginUser } from "../services/LoginApi";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    identifier: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
      setFieldErrors({
        identifier: "",
        password: ""
      });
    }
  };

  const handleLogin = async () => {
    // Reset all errors
    setError(null);
    setFieldErrors({
      identifier: "",
      password: ""
    });

    // Validate inputs
    if (!credentials.identifier && !credentials.password) {
      setFieldErrors({
        identifier: "Email or username is required",
        password: "Password is required"
      });
      return;
    }
    
    if (!credentials.identifier) {
      setFieldErrors(prev => ({
        ...prev,
        identifier: "Email or username is required"
      }));
      return;
    }
    
    if (!credentials.password) {
      setFieldErrors(prev => ({
        ...prev,
        password: "Password is required"
      }));
      return;
    }

    setIsLoading(true);
    
    try {
      const { token, user } = await loginUser(credentials);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/echoo');
    } catch (err) {
      // Handle different error types
      if (err.message === 'Email or username not found') {
        setFieldErrors({
          identifier: err.message,
          password: ""
        });
      } else if (err.message === 'Password is incorrect') {
        setFieldErrors({
          identifier: "",
          password: err.message
        });
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* Global Error Message (for server errors) */}
        {error && (
          <Form.Text className="text-danger d-block mb-3">
            {error}
          </Form.Text>
        )}
        
        <LoginInputFields 
          credentials={credentials} 
          onChange={handleChange}
          errors={fieldErrors}
        />

        <Button
          className="w-100 rounded-4 fw-semibold shadow bg-black border-none mt-3"
          style={{ height: "45px" }}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

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

      <div></div>
    </div>
  );
};

export default Login;