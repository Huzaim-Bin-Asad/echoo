import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const userRef = useRef(null); // to keep latest user state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    let requestCount = 0;

    const fetchUser = () => {
      axios.get('http://localhost:5000/api/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          const newUserData = res.data;

          requestCount += 1;

          if (requestCount === 1) {
            console.log("✅ [100th Poll] User data received:", newUserData);

            if (JSON.stringify(userRef.current) !== JSON.stringify(newUserData)) {
              console.log("🆕 User data updated.");
            }

            requestCount = 0;
          }

          setUser(newUserData);
          userRef.current = newUserData;
          setLoading(false);
        })
        .catch(err => {
          console.error("❌ Failed to fetch user:", err);
          setUser(null);
          userRef.current = null;
          setLoading(false);
        });
    };

    const intervalId = setInterval(fetchUser, 500); // Poll every 0.5s

    return () => clearInterval(intervalId); // Cleanup
  }, []); // Run only once on mount

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
