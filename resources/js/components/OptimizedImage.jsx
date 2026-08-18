import React, { useEffect, useState } from "react";

export function OptimizedImage({ src, fallbackSrc = "", alt = "", width, height, quality, onError, ...props }) {
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => setActiveSrc(src), [src]);

  function handleError(event) {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
      return;
    }
    onError?.(event);
  }

  return <img
    {...props}
    src={activeSrc}
    alt={alt}
    width={width}
    height={height}
    decoding="async"
    onError={handleError}
  />;
}
