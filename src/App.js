// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Signup from "./pages/Signup";
import Login from "./pages/login"; // ✅ Import Login component
import Echoo from "./pages/Echoos"; // Create this component if it doesn't exist
import Add from './pages/Add'; // path to Add.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Add login route */}
        <Route path="/echoo" element={<Echoo />} />
        <Route path="/add" element={<Add />} />

      </Routes>
    </Router>
  );
}

export default App;
