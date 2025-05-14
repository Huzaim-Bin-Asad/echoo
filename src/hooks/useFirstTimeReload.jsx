import { useEffect } from "react";

const useFirstTimeReload = () => {
  useEffect(() => {
    const isFirstTime = localStorage.getItem("first-time");

    if (!isFirstTime) {
      localStorage.setItem("first-time", "done");
      window.location.reload(); // Force one-time reload
    }
  }, []);
};

export default useFirstTimeReload;
