import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
} from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const userRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const requestCountRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = () => {
      axios
        .get("http://localhost:5000/api/userinfo", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const newUserData = res.data;
          requestCountRef.current += 1;

          // Print full response data every 10 requests
          if (requestCountRef.current % 20 === 0) {
            if (
              JSON.stringify(userRef.current) !== JSON.stringify(newUserData)
            ) {
            } else {
            }
          }

          setUser(newUserData);
          userRef.current = newUserData;
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch user:", err);
          setUser(null);
          userRef.current = null;
          setLoading(false);
        });
    };

    const intervalId = setInterval(fetchUser, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
