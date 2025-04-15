// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Signup from "./pages/Signup";
import Login from "./pages/login";
import Echoo from "./pages/Echoos";
import Add from './pages/Add';
import NewContact from './pages/NewContact';
import NewGroup from './pages/NewGroup'; // Import the NewGroup component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/echoo" element={<Echoo />} />
        <Route path="/add" element={<Add />} />
        <Route path="/new-contact" element={<NewContact />} />
        <Route path="/new-group" element={<NewGroup />} /> {/* Added NewGroup route */}
      </Routes>
    </Router>
  );
}

export default App;