import React from "react";
import girl2 from "../../../assets/girl2.jpg";
import girl7 from "../../../assets/girl7.jpg";
import boy11 from "../../../assets/boy11.jpg";

const MediaLinksDocs = () => {
  return (
    <div
      className="bg-white"
      style={{
        width: "calc(100% + 28px)",
        marginLeft: "-15px",
        marginTop: "15px",
        minHeight: "150px",
      }}
    >
      <h6
        className="text-uppercase text-secondary py-3"
        style={{ marginLeft: "15px" }}
      >
        Media, links, and docs
      </h6>
      <div
        className="d-flex gap-3 px-3 pb-3"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          flexWrap: "nowrap",
        }}
      >
        <img
          src={girl2}
          className="rounded"
          alt="Media 1"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={girl7}
          className="rounded"
          alt="Media 2"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={boy11}
          className="rounded"
          alt="Media 3"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
         <img
          src={girl2}
          className="rounded"
          alt="Media 1"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={girl7}
          className="rounded"
          alt="Media 2"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={boy11}
          className="rounded"
          alt="Media 3"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        /> <img
          src={girl2}
          className="rounded"
          alt="Media 1"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={girl7}
          className="rounded"
          alt="Media 2"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
        <img
          src={boy11}
          className="rounded"
          alt="Media 3"
          width="80"
          height="80"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default MediaLinksDocs;
