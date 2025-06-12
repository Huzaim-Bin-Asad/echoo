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
      console.warn("⚠️ No token found in localStorage.");
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

          const newChatPreview = newUserData.chat_preview || [];
          const currentChatPreview =
            JSON.parse(localStorage.getItem("PersonalChatPreviews")) || [];

          const isDifferent =
            JSON.stringify(currentChatPreview) !==
            JSON.stringify(newChatPreview);

          if (isDifferent) {
            console.log("🔁 chat_preview changed. Updating cache.");
            localStorage.setItem(
              "PersonalChatPreviews",
              JSON.stringify(newChatPreview)
            );
          } else if (requestCountRef.current % 20 === 0) {
            console.log("ℹ️ chat_preview unchanged on 20th request");
          }

    

          setUser(newUserData);
          userRef.current = newUserData;
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch user:", err.response?.data || err);
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
