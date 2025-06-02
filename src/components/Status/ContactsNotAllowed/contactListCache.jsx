import { useEffect } from "react";

function ContactListCache() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔁 [ContactListCache] Checking for updates...");

      const userString = localStorage.getItem("user");
      if (!userString) {
        console.warn("⚠️ No user data found in localStorage.");
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userString);
      } catch (err) {
        console.error("❌ Failed to parse user data from localStorage:", err);
        return;
      }

      if (!userData.user_id) {
        console.warn("⚠️ user_id is missing in localStorage user object.");
        return;
      }

      console.log(`📡 Sending request for user_id: ${userData.user_id}`);

      fetch("http://localhost:5000/api/notAllowedContacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userData.user_id })
      })
        .then(res => {
          console.log("📥 Received response with status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("📦 Fetched contacts:", data);

          const cached = localStorage.getItem("HideStatusList");
          const cachedData = cached ? JSON.parse(cached) : null;

          const current = JSON.stringify(data);
          const previous = JSON.stringify(cachedData);

          if (current !== previous) {
            console.log("✅ Detected change in contact list. Updating cache...");
            localStorage.setItem("HideStatusList", current);
          } else {
            console.log("🟢 No change detected. Cache remains the same.");
          }
        })
        .catch(err => {
          console.error("❌ Error while fetching contacts:", err);
        });
    }, 2000); // every 2 seconds

    console.log("🚀 ContactListCache interval started");

    return () => {
      console.log("🧹 Clearing ContactListCache interval");
      clearInterval(interval);
    };
  }, []);

  return null;
}

export default ContactListCache;
