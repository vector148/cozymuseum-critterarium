export function restoreRouteSurface({ scrollTo, closeSidebar }) {
  closeSidebar?.();
  scrollTo?.({ top: 0, behavior: "auto" });
}
