import { useState } from "react";
import { api } from "../api/index.js";

const INITIAL = { realmId: "animalia", commonNameEn: "", commonNameVi: "", scientificName: "", phylum: "Chordata", className: "Mammalia", lifeState: "extant" };

export default function CreateOrganismForm({ locale, onCreated, onCancel }) {
  const vi = locale === "vi";
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.createOrganism(form);
      onCreated();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="create-organism-form glass-card" onSubmit={submit}>
      <div className="create-organism-heading">
        <span>{vi ? "MẪU VẬT ĐẦU TIÊN" : "FIRST SPECIMEN"}</span>
        <h2>{vi ? "Bắt đầu bảo tàng của bạn" : "Begin your museum"}</h2>
        <p>{vi ? "Dữ liệu này chỉ được lưu trên máy của bạn." : "This record stays on your computer."}</p>
      </div>
      <div className="create-organism-grid">
        <label>Realm<select value={form.realmId} onChange={(event) => update("realmId", event.target.value)}><option value="animalia">Animalia</option><option value="plantae_fungi">Plantae &amp; Fungi</option><option value="sar">SAR</option><option value="microverse">Microverse</option></select></label>
        <label>{vi ? "Tên khoa học" : "Scientific name"}<input required value={form.scientificName} onChange={(event) => update("scientificName", event.target.value)} /></label>
        <label>{vi ? "Tên thường gọi" : "Common name"}<input required value={form.commonNameEn} onChange={(event) => update("commonNameEn", event.target.value)} /></label>
        <label>{vi ? "Tên tiếng Việt" : "Vietnamese name"}<input value={form.commonNameVi} onChange={(event) => update("commonNameVi", event.target.value)} /></label>
        <label>Phylum<input value={form.phylum} onChange={(event) => update("phylum", event.target.value)} /></label>
        <label>Class<input required value={form.className} onChange={(event) => update("className", event.target.value)} /></label>
        <label>{vi ? "Trạng thái" : "Life state"}<select value={form.lifeState} onChange={(event) => update("lifeState", event.target.value)}><option value="extant">{vi ? "Hiện sinh" : "Extant"}</option><option value="extinct">{vi ? "Tuyệt chủng" : "Extinct"}</option></select></label>
      </div>
      {error ? <p className="create-organism-error" role="alert">{error}</p> : null}
      <div className="create-organism-actions"><button className="btn" type="button" onClick={onCancel}>{vi ? "Để sau" : "Not now"}</button><button className="btn btn-primary" type="submit" disabled={saving}>{saving ? (vi ? "Đang lưu..." : "Saving...") : (vi ? "Thêm vào bảo tàng" : "Add to museum")}</button></div>
    </form>
  );
}
