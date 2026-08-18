import { forwardRef } from "react";

const GlassSurface = forwardRef(function GlassSurface({ as: Tag = "section", variant = "regular", className = "", children, ...props }, ref) {
  const classes = ["glass-surface", `glass-surface-${variant}`, className].filter(Boolean).join(" ");

  return (
    <Tag className={classes} ref={ref} {...props}>
      {children}
    </Tag>
  );
});

export default GlassSurface;
