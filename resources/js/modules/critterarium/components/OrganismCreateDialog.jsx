import { useEffect, useId, useRef, useState } from "react";
import { api } from "../api/index.js";

const INITIAL = { realmId: "animalia", commonNameEn: "", commonNameVi: "", scientificName: "", phylum: "Chordata", className: "Mammalia", lifeState: "extant", score: "", coverUrl: "" };

export default function OrganismCreateDialog({ locale, onCreated, onClose }) {
  const vi = locale === "vi";
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  function requestClose() {
    if (saving) return;
    onClose?.();
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await api.createOrganism(form);
      onCreated();
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
    }
  }

  return (
    <div className="catalog-create-layer">
      <button type="button" className="catalog-create-backdrop" onClick={requestClose} aria-label="Close add organism dialog" tabIndex="-1" />
      <section
        ref={dialogRef}
        className="catalog-create-dialog catalog-create-organism"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="catalog-create-header">
          <div>
            <span className="catalog-create-eyebrow">{vi ? "MẪU VẬT ĐẦU TIÊN" : "FIRST SPECIMEN"}</span>
            <h2 id={titleId}>{vi ? "Thêm một sinh vật mới" : "Add a new organism"}</h2>
            <p id={descriptionId}>{vi ? "Dữ liệu này chỉ được lưu trên máy của bạn." : "This record stays on your computer."}</p>
          </div>
          <button type="button" className="catalog-create-close" onClick={requestClose} disabled={saving} aria-label="Close">x</button>
        </header>

        <form className="catalog-create-form" onSubmit={submit}>
          <div className="catalog-create-body">
            <div className="catalog-create-fields">
              <div className="catalog-create-field-grid">
                <label className="catalog-create-field">
                  <span>Realm</span>
                  <select className="planning-input" value={form.realmId} onChange={(event) => update("realmId", event.target.value)}>
                    <option value="animalia">Animalia</option>
                    <option value="plantae_fungi">Plantae &amp; Fungi</option>
                    <option value="sar">SAR</option>
                    <option value="microverse">Microverse</option>
                  </select>
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Tên khoa học" : "Scientific name"}</span>
                  <input autoFocus className="planning-input" required value={form.scientificName} onChange={(event) => update("scientificName", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Tên thường gọi" : "Common name"}</span>
                  <input className="planning-input" required value={form.commonNameEn} onChange={(event) => update("commonNameEn", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Tên tiếng Việt" : "Vietnamese name"}</span>
                  <input className="planning-input" value={form.commonNameVi} onChange={(event) => update("commonNameVi", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>Phylum</span>
                  <input className="planning-input" value={form.phylum} onChange={(event) => update("phylum", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>Class</span>
                  <input className="planning-input" required value={form.className} onChange={(event) => update("className", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Trạng thái" : "Life state"}</span>
                  <select className="planning-input" value={form.lifeState} onChange={(event) => update("lifeState", event.target.value)}>
                    <option value="extant">{vi ? "Hiện sinh" : "Extant"}</option>
                    <option value="extinct">{vi ? "Tuyệt chủng" : "Extinct"}</option>
                  </select>
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Điểm Hall of Fame" : "Hall of Fame Score"}</span>
                  <input className="planning-input" type="number" min="0" max="10" step="0.1" value={form.score} onChange={(event) => update("score", event.target.value)} />
                </label>
                <label className="catalog-create-field">
                  <span>{vi ? "Link ảnh (Cover URL)" : "Cover URL"}</span>
                  <input className="planning-input" type="url" value={form.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} />
                </label>
              </div>
              <div className="catalog-create-server-error" role="status" aria-live="polite">{error}</div>
            </div>
            
            <aside className="catalog-create-preview-column">
              <span className="catalog-create-preview-label">Live preview</span>
              <div className="catalog-create-preview preview-games" aria-label="Card preview">
                <div className="catalog-create-preview-cover">
                  {form.coverUrl ? (
                    <img src={form.coverUrl} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span>{form.realmId === "plantae_fungi" ? "Plantae" : (form.realmId === "animalia" ? "Animalia" : "Organism")}</span>
                  )}
                </div>
                <div className="catalog-create-preview-meta">
                  <strong>{form.scientificName.trim() || "Unknown species"}</strong>
                  <span>{form.commonNameEn || form.commonNameVi || "No common name"}</span>
                </div>
              </div>
            </aside>
          </div>

          <footer className="catalog-create-actions">
            <button type="button" className="btn" onClick={requestClose} disabled={saving}>{vi ? "Hủy" : "Cancel"}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (vi ? "Đang lưu..." : "Saving...") : (vi ? "Thêm vào bảo tàng" : "Add to museum")}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
