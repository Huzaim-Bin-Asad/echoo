import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

const CACHE_KEY = "profileSettingCache";

const ProfileSetting = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    full_name: "",
    about_message: "",
    profile_picture: null,
  });
  const pollingRef = useRef(null);

  // Load from cache or backend on mount
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    let user_id;
    try {
      user_id = JSON.parse(userString).user_id;
    } catch {
      return;
    }

    // Load from cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setUserData(cachedData);
      } catch {}
    }

    // Poll backend every second for updates
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/SettingUserDataUpdate",
          { user_id }
        );
        const freshData = response.data;

        // Check if fresh data is different from cached
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (!cachedData || cachedData !== JSON.stringify(freshData)) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshData));
          setUserData(freshData);
        }
      } catch (err) {
        console.error("Polling fetch error:", err);
      }
    };

    // Initial fetch
    fetchData();

    // Start polling every 1000 ms
    pollingRef.current = setInterval(fetchData, 1000);

    // Cleanup on unmount
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="border-bottom pb-2 mb-3" style={{ height: "85px" }}>
      <div className="d-flex justify-content-between align-items-start">
        {/* Profile with picture or fallback icon */}
        <div
          className="d-flex align-items-center gap-4"
          style={{ cursor: "pointer" }}
          onClick={handleProfileClick}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#2d2d2d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userData.profile_picture ? (
              <img
                src={userData.profile_picture}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <User size={42} color="white" />
            )}
          </div>

          <div style={{ marginLeft: "-10px" }}>
            <h5 className="mb-1" style={{ fontSize: "1.25rem" }}>
              {userData.full_name || ""}
            </h5>
            <small className="text-white" style={{ fontSize: ".85rem" }}>
              {userData.about_message || ""}
            </small>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ transform: "translate(-4px, 15px)" }}>
          <QRCodeSVG
            value="keenshaheer123"
            size={27}
            bgColor="#212529"
            fgColor="#ffffff"
            level="H"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
