import { useEffect } from "react";

export default function BarcodeFetcher() {
  useEffect(() => {
    const fetchBarcodeData = async () => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.warn("No user object found in localStorage.");
        return;
      }

      let userData;
      try {
        userData = JSON.parse(userString);
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
        return;
      }

      const userId = userData.user_id;
      if (!userId) {
        console.warn("user_id missing in parsed user data.");
        return;
      }

      try {
        const response = await fetch("https://echoo-backend.vercel.app/api/user-barcode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user barcode data.");
        }

        const data = await response.json();
        localStorage.setItem("BarcodeData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching barcode data:", error);
      }
    };

    fetchBarcodeData();
  }, []);

  return null;
}
