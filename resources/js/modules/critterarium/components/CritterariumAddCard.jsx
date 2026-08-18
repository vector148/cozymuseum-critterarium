import { useRef, useState } from "react";
import OrganismCreateDialog from "./OrganismCreateDialog.jsx";

export default function CritterariumAddCard({ locale, onCreated }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  function closeCreator() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="catalog-add-card catalog-add-organism"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="catalog-add-orb" aria-hidden="true">+</span>
        <span className="catalog-add-copy">
          <strong>{locale === "vi" ? "Thêm sinh vật" : "Add critter"}</strong>
          <span>{locale === "vi" ? "Tạo hồ sơ trưng bày mới" : "Create a new exhibit"}</span>
        </span>
      </button>

      {open ? (
        <OrganismCreateDialog
          locale={locale}
          onCreated={() => {
            closeCreator();
            onCreated?.();
          }}
          onClose={closeCreator}
        />
      ) : null}
    </>
  );
}
