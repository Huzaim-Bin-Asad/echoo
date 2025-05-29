import Header from "./Header";
import ViewerList from "./ViewerList";

const viewers = [
  { name: "Humna Asad", time: "Just now", avatar: "https://via.placeholder.com/32" },
  { name: "Humna Asad", time: "Just now", avatar: "https://via.placeholder.com/32" },
]

const ViewerWrapper = ({ onHeaderClick }) => (
  <div
    style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "108%",
      maxWidth: "400px", // optional max width for smaller containers
      margin: "0 auto",
      backgroundColor: "transparent",
      padding: "16px",
      borderRadius: "8px 8px 0 0", // rounded top corners only
      zIndex: 1000,
      // Allow the height to grow upwards by controlling maxHeight + overflow
      maxHeight: "50vh",
      overflowY: "auto",
            overflowX: "hidden",  // <-- add this line
      display: "flex",
      flexDirection: "column",
      // Align items so the content grows upward visually
      justifyContent: "flex-end",
    }}
  >
    <Header count={viewers.length} onClick={onHeaderClick} />
    <ViewerList viewers={viewers} />
  </div>
);

export default ViewerWrapper;
