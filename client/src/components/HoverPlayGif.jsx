"use client";

import { useRef, useState } from "react";

// GIFs can't be paused with CSS, so we draw the first loaded frame onto a
// canvas and keep it on top as a static freeze-frame. The real <img> keeps
// looping underneath, hidden, and is only revealed (canvas faded out) on hover.
export default function HoverPlayGif({ src, alt, className = "", onError }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [frozen, setFrozen] = useState(false);
  const [hovered, setHovered] = useState(false);

  function captureFrame() {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.naturalWidth) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    try {
      canvas.getContext("2d").drawImage(img, 0, 0);
      setFrozen(true);
    } catch {
      // Cross-origin draw failures just mean no freeze-frame; the gif still shows.
    }
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={captureFrame}
        onError={onError}
        className="h-full w-full object-contain"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-150"
        style={{ opacity: frozen && !hovered ? 1 : 0 }}
      />
    </div>
  );
}
