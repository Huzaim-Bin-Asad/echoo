const ViewerList = ({ viewers }) => (
  <div
    className="d-flex flex-column px-3 py-2"
    style={{
      borderRadius: "4px",
      backgroundColor: "#121212", // darker than header (#1e1e1e)
      width: "108%",
      marginLeft: "-15px",
      minHeight: "100px",
      maxHeight: "300px",      // max height for scroll container (adjust as needed)
      overflowY: "auto",       // enable vertical scrolling when content exceeds max height
      zIndex: 1000,
      position: "relative",    // needed for zIndex to work properly
    }}
  >
    {viewers.map((viewer, index) => (
      <div
        key={index}
        className="d-flex align-items-center justify-content-between py-2"
        style={{ marginBottom: "6px" }}
      >
        <div className="d-flex align-items-center gap-3">
          <img
            src={viewer.avatar}
            alt={viewer.name}
            className="rounded-circle object-fit-cover"
            style={{ width: "32px", height: "32px" }}
          />
          <div>
            <div className="fw-medium text-white">{viewer.name}</div>
            <div className="text-muted small">{viewer.time}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ViewerList;
