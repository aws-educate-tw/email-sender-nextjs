import React from "react";

interface IframePreviewProps {
  src: string;
  title: string;
  width: string;
  height: string;
}

export default function IframePreview({
  src,
  title,
  width,
  height,
}: IframePreviewProps) {
  return (
    <div style={{ width, height }}>
      <iframe
        src={src}
        title={title}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
}
