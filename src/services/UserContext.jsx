import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To track loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false); // Token is not present, so set loading to false
      return;
    }

    axios.get('http://localhost:5000/api/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const newUserData = res.data;

        console.log("✅ User data received from backend:", newUserData);

        // If the user data is different from current, update the state
        if (JSON.stringify(user) !== JSON.stringify(newUserData)) {
          console.log("🆕 User data updated from backend.");
        }

        setUser(newUserData);
        setLoading(false); // Once data is received, stop loading
      })
      .catch(err => {
        console.error("❌ Failed to fetch user:", err);
        setUser(null);
        setLoading(false); // Handle error and stop loading
      });
  }, [user]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
