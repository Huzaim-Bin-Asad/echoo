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
      .get("https://echoo-backend.vercel.app/api/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const newUserData = res.data;
        requestCountRef.current += 1;

        // Optional: Print full response data every 20 requests if it changed
        if (requestCountRef.current % 20 === 0) {
          if (
            JSON.stringify(userRef.current) !== JSON.stringify(newUserData)
          ) {
            console.log(
              "🔄 User data changed on 20th request:",
              newUserData
            );
          } else {
            console.log("ℹ️ User data unchanged on 20th request");
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
