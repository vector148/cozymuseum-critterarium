import { useRef, useState } from "react";
import OrganismCreateDialog from "./OrganismCreateDialog.jsx";
import { t } from "../../../i18n.js";

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
        className="card catalog-add-card type-organism organism-card catalog-add-organism"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="cover-wrap catalog-add-cover">
          <span className="catalog-add-orb" aria-hidden="true">+</span>
        </div>
        <div className="meta catalog-add-meta">
          <div className="title">{t(locale, "addOrganism")}</div>
          <div className="artist">{t(locale, "createCardHint")}</div>
          <div className="row">
            <span className="pill pill-add-badge">+ {locale === "vi" ? "MỚI" : "NEW"}</span>
            <span className="catalog-add-hint">Critterarium</span>
          </div>
        </div>
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
