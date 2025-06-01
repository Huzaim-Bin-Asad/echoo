import likedImg from "../../../../assets/liked.png";

const ViewerList = ({ viewers }) => (
  <div
    className="d-flex flex-column px-3 py-2"
    style={{
      borderRadius: "4px",
      backgroundColor: "#121212",
      width: "108%",
      marginLeft: "-15px",
      minHeight: "100px",
      maxHeight: "300px",
      overflowY: "auto",
      zIndex: 1000,
      position: "relative",
    }}
  >
    {viewers.map((viewer, index) => (
      <div
        key={index}
        className="d-flex align-items-center justify-content-between py-2"
        style={{ marginBottom: "6px" }}
      >
        <div className="d-flex align-items-center gap-3" style={{ position: "relative" }}>
          <div style={{ position: "relative", width: "32px", height: "32px" }}>
            <img
              src={viewer.avatar}
              alt={viewer.name}
              className="rounded-circle object-fit-cover"
              style={{ width: "32px", height: "32px" }}
            />
            {viewer.liked && (
              <img
                src={likedImg}
                alt="Liked"
                style={{
                  position: "absolute",
                  bottom: -4 ,
                  right: -4,
                  width: "16px",
                  height: "16px",
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                  padding: "1px",
                }}
              />
            )}
          </div>
          <div>
            <div className="fw-medium text-white">{viewer.name}</div>
            {viewer.time && <div className="text-muted small">{viewer.time}</div>}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ViewerList;
