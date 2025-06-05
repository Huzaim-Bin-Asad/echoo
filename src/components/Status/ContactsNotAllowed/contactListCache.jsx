import { useEffect } from "react";

function ContactListCache() {
  useEffect(() => {
    const interval = setInterval(() => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userString);
      } catch (err) {
        return;
      }

      fetch("https://echoo-backend.vercel.app/api/notAllowedContacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userData.user_id }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const cached = localStorage.getItem("HideStatusList");
          const cachedData = cached ? JSON.parse(cached) : null;

          const current = JSON.stringify(data);
          const previous = JSON.stringify(cachedData);

          if (current !== previous) {
            localStorage.setItem("HideStatusList", current);
          } else {
          }
        })
        .catch((err) => {});
    }, 2000); // every 2 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}

export default ContactListCache;
