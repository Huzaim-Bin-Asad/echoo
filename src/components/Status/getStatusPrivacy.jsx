// getStatusPrivacy.js

function fetchStatusPrivacy() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.user_id;

  if (!userId) {
    console.error("❌ No user ID found in localStorage.");
    return Promise.resolve(null);
  }

  return fetch("https://echoo-backend.vercel.app/api/status-privacy-get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("❌ Failed to fetch status privacy");
        return null;
      }
      return response.json();
    })
    .then((data) => {
      const privacyType = data?.type_selected || "contacts";
      localStorage.setItem("StatusOptionSelected", privacyType);
      console.log("📦 Received and cached privacy type:", privacyType);
      return data;
    })
    .catch((err) => {
      console.error("❌ Error fetching status privacy:", err);
      return null;
    });
}

export default fetchStatusPrivacy;
