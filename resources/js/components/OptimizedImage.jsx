import React from "react";

export function OptimizedImage({ src, alt = "", ...props }) {
  if (!src) return null;
  return <img src={src} alt={alt} {...props} />;
}

