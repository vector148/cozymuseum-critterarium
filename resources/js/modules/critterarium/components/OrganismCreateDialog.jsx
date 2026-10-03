import { useEffect, useId, useRef, useState } from "react";
import { api } from "../api/index.js";
import { t } from "../../../i18n.js";
import {
  buildOrganismCreateDraft,
  buildOrganismEditDraft,
  coverNeedsImport,
  saveOrganismDraft,
} from "../organism-editor.js";
import { suggestTaxonomy } from "../taxonomy-suggestions.js";
import CritterariumSelect from "./CritterariumSelect.jsx";
import {
  uploadCompressedImage,
  cloneLocalPathImage,
  importExternalUrlImage,
  isLocalFilePath,
} from "../../../utils/imageCompressor.js";

function cleanCoverInput(val) {
  let s = String(val ?? "");
  const trimmed = s.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }
  return s;
}

function resolvePreviewSrc(cover) {
  if (!cover) return "";
  let s = cleanCoverInput(cover);
  if (!s) return "";
  if (/^https?:\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:")) {
    return s;
  }
  if (s.startsWith("/images/") || s.startsWith("images/")) {
    return s.startsWith("/") ? s : `/${s}`;
  }
  return `/api/media/preview?path=${encodeURIComponent(s)}`;
}

export default function OrganismCreateDialog({ locale = "en", mode = "create", initialItem = null, onSubmit, onCreated, onSaved, onClose }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(() => isEdit ? buildOrganismEditDraft(initialItem) : buildOrganismCreateDraft());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [processingCover, setProcessingCover] = useState(false);
  const pendingCoverPromiseRef = useRef(null);
  const [imgError, setImgError] = useState(false);
  const dialogRef = useRef(null);
  const detailsRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  const previewSrc = resolvePreviewSrc(form.coverUrl);
  const taxonomySuggestions = suggestTaxonomy(form.commonNameEn)
    .filter((suggestion) => !isEdit || suggestion.realmId === form.realmId);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  async function handleImageFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const instantUrl = URL.createObjectURL(file);
    update("coverUrl", instantUrl);
    setProcessingCover(true);
    const promise = uploadCompressedImage({
      fileOrBlob: file,
      filename: file.name || "organism.jpg",
      category: "catalog/uploads",
      maxKb: 500,
    }).then((result) => {
      if (result?.localPath) {
        update("coverUrl", result.localPath);
        return result.localPath;
      }
      return null;
    }).catch((err) => {
      console.error("Organism image file upload failed:", err);
      return null;
    }).finally(() => {
      setProcessingCover(false);
      pendingCoverPromiseRef.current = null;
    });

    pendingCoverPromiseRef.current = promise;
    return promise;
  }

  async function handleTextCover(rawText) {
    const cleaned = cleanCoverInput(rawText);
    if (!cleaned) return;
    update("coverUrl", cleaned);

    if (isLocalFilePath(cleaned)) {
      setProcessingCover(true);
      const promise = cloneLocalPathImage({
        filePath: cleaned,
        category: "catalog/uploads",
        maxKb: 500,
      }).then((result) => {
        if (result?.localPath) {
          update("coverUrl", result.localPath);
          return result.localPath;
        }
        return null;
      }).catch((err) => {
        console.error("Local cover clone failed:", err);
        return null;
      }).finally(() => {
        setProcessingCover(false);
        pendingCoverPromiseRef.current = null;
      });

      pendingCoverPromiseRef.current = promise;
      return promise;
    } else if (/^https?:\/\//i.test(cleaned) && !cleaned.startsWith("/images/")) {
      setProcessingCover(true);
      const promise = importExternalUrlImage({
        url: cleaned,
        category: "catalog/uploads",
        title: form.scientificName || form.commonNameEn || "organism",
      }).then((result) => {
        if (result?.localPath) {
          update("coverUrl", result.localPath);
          return result.localPath;
        }
        return null;
      }).catch((err) => {
        console.warn("External URL import non-fatal fallback:", err.message);
        return null;
      }).finally(() => {
        setProcessingCover(false);
        pendingCoverPromiseRef.current = null;
      });

      pendingCoverPromiseRef.current = promise;
      return promise;
    }
  }

  useEffect(() => {
    function handleGlobalPaste(event) {
      if (saving) return;
      const files = event.clipboardData?.files;
      if (files && files.length > 0 && files[0].type.startsWith("image/")) {
        event.preventDefault();
        handleImageFile(files[0]);
        return;
      }

      const active = document.activeElement;
      const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
      const isCoverInput = active && active.classList.contains("field-cover-input");
      if (!isInput || isCoverInput) {
        const text = event.clipboardData?.getData("text");
        if (text && (isLocalFilePath(text) || /^https?:\/\//i.test(text.trim()))) {
          event.preventDefault();
          handleTextCover(text);
        }
      }
    }

    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [form.scientificName, form.commonNameEn, saving]);

  useEffect(() => {
    setImgError(false);
  }, [previewSrc]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving && !processingCover) {
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
    if (saving || processingCover) return;
    onClose?.();
  }

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    if (!form.scientificName.trim() || !form.className.trim()) {
      detailsRef.current.open = true;
      setError(locale === "vi" ? "Hãy nhập tên khoa học và chọn lớp trước khi lưu." : "Add a scientific name and choose a class before saving.");
      requestAnimationFrame(() => detailsRef.current?.querySelector(!form.scientificName.trim() ? '[name="scientificName"]' : '[name="className"]')?.focus());
      return;
    }

    let finalCoverUrl = form.coverUrl;
    if (pendingCoverPromiseRef.current) {
      try {
        const resolved = await pendingCoverPromiseRef.current;
        if (resolved) finalCoverUrl = resolved;
      } catch (err) {
        console.warn("Awaiting pending cover failed:", err);
      }
    }

    const shouldImportCover = coverNeedsImport({ mode, initialItem, coverUrl: finalCoverUrl });
    if (shouldImportCover && isLocalFilePath(finalCoverUrl)) {
      try {
        setProcessingCover(true);
        const result = await cloneLocalPathImage({
          filePath: finalCoverUrl,
          category: "catalog/uploads",
          maxKb: 500,
        });
        if (result?.localPath) {
          finalCoverUrl = result.localPath;
          update("coverUrl", finalCoverUrl);
        }
      } catch (err) {
        console.error("Pre-submit local clone failed:", err);
      } finally {
        setProcessingCover(false);
      }
    } else if (shouldImportCover && /^https?:\/\//i.test(finalCoverUrl) && !finalCoverUrl.startsWith("/images/")) {
      try {
        setProcessingCover(true);
        const result = await importExternalUrlImage({
          url: finalCoverUrl,
          category: "catalog/uploads",
          title: form.scientificName || form.commonNameEn || "organism",
        });
        if (result?.localPath) {
          finalCoverUrl = result.localPath;
          update("coverUrl", finalCoverUrl);
        }
      } catch (err) {
        console.error("Pre-submit URL import failed:", err);
      } finally {
        setProcessingCover(false);
      }
    }

    setSaving(true);
    setError("");
    try {
      const draft = { ...form, coverUrl: finalCoverUrl };
      const saved = onSubmit
        ? await onSubmit(draft)
        : await saveOrganismDraft({ mode, initialItem, draft, api });
      onSaved?.(saved);
      onCreated?.(saved);
    } catch (requestError) {
      setError(requestError.message);
      setSaving(false);
    }
  }

  return (
    <div className="catalog-create-layer">
      <button type="button" className="catalog-create-backdrop" onClick={requestClose} aria-label={t(locale, "close")} tabIndex="-1" />
      <section
        ref={dialogRef}
        className="catalog-create-dialog catalog-create-organism"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer?.files?.[0];
          if (file && file.type.startsWith("image/")) {
            handleImageFile(file);
          }
        }}
      >
        <header className="catalog-create-header">
          <div>
            <span className="catalog-create-eyebrow">{t(locale, isEdit ? "editEyebrow" : "createEyebrow")}</span>
            <h2 id={titleId}>{t(locale, isEdit ? "editOrganism" : "addOrganism")}</h2>
            <p id={descriptionId}>{t(locale, isEdit ? "editHint" : "createHint")}</p>
          </div>
          <button type="button" className="catalog-create-close" onClick={requestClose} disabled={saving || processingCover} aria-label={t(locale, "close")}>x</button>
        </header>

        <form className="catalog-create-form" onSubmit={submit}>
          <div className="catalog-create-body">
            <div className="catalog-create-fields">
              <div className="catalog-create-field-grid">
                {/* 1. Cover field ALWAYS AT THE TOP */}
                <label className="catalog-create-field field-cover">
                  <span>{t(locale, "cover")} <small>({t(locale, "coverHint")})</small></span>
                  <div className="catalog-create-classification-control">
                    <input
                      className="planning-input field-cover-input"
                      type="text"
                      placeholder={processingCover ? t(locale, "processingCover") : "https://... or C:\\path\\to\\image.png"}
                      value={form.coverUrl}
                      onChange={(event) => {
                        const val = event.target.value;
                        update("coverUrl", val);
                        const cleaned = cleanCoverInput(val);
                        if (isLocalFilePath(cleaned) || (/^https?:\/\//i.test(cleaned) && !cleaned.startsWith("/images/"))) {
                          handleTextCover(cleaned);
                        }
                      }}
                      onBlur={(event) => {
                        if (coverNeedsImport({ mode, initialItem, coverUrl: event.target.value })) {
                          handleTextCover(event.target.value);
                        }
                      }}
                      onPaste={(event) => {
                        const files = event.clipboardData?.files;
                        if (files && files.length > 0 && files[0].type.startsWith("image/")) {
                          event.preventDefault();
                          handleImageFile(files[0]);
                          return;
                        }
                        const pasted = event.clipboardData?.getData("text");
                        if (pasted && (isLocalFilePath(pasted) || /^https?:\/\//i.test(pasted.trim()))) {
                          event.preventDefault();
                          handleTextCover(pasted);
                        }
                      }}
                    />
                    <label
                      className={`catalog-taxonomy-gear catalog-browse-btn ${processingCover ? "processing" : ""}`}
                      title={processingCover ? t(locale, "processingCover") : t(locale, "browseImage")}
                      aria-label={t(locale, "browseImage")}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        disabled={processingCover}
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          handleImageFile(file);
                          event.target.value = "";
                        }}
                      />
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </label>
                  </div>
                </label>

                <label className="catalog-create-field field-title">
                  <span>{t(locale, "commonName")}</span>
                  <input autoFocus className="planning-input" required value={form.commonNameEn} onChange={(event) => update("commonNameEn", event.target.value)} />
                </label>
                {taxonomySuggestions.length > 0 ? (
                  <div className="catalog-create-taxonomy-suggestions catalog-create-field-wide" role="group" aria-label={locale === "vi" ? "Gợi ý phân loại" : "Suggested classification"}>
                    <span>{locale === "vi" ? "Gợi ý phân loại · chọn để áp dụng" : "Classification suggestions · choose to apply"}</span>
                    <div>
                      {taxonomySuggestions.map((suggestion) => (
                        <button key={suggestion.className} type="button" aria-pressed={form.className === suggestion.className} onClick={() => setForm((current) => ({ ...current, ...suggestion, realmId: isEdit ? current.realmId : suggestion.realmId }))}>
                          {suggestion.className}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <CritterariumSelect label={t(locale, "lifeState")} value={form.lifeState}
                  options={[{ value: "extant", label: t(locale, "extantStatus") }, { value: "extinct", label: t(locale, "extinctStatus") }]}
                  onChange={(value) => update("lifeState", value)} />

                <label className="catalog-create-field">
                  <span>{t(locale, "score")}</span>
                  <input className="planning-input" type="number" min="0" max="10" step="0.1" value={form.score} onChange={(event) => update("score", event.target.value)} />
                </label>

                <details ref={detailsRef} className="catalog-create-details catalog-create-field-wide">
                  <summary className="catalog-create-details-toggle">{locale === "vi" ? "Phân loại khoa học và chi tiết" : "Scientific classification and details"}<span aria-hidden="true">+</span></summary>
                  <div className="catalog-create-field-grid">
                    <CritterariumSelect label={t(locale, "realm")} value={form.realmId} disabled={isEdit}
                      options={[{ value: "animalia", label: "Animalia" }, { value: "plantae_fungi", label: "Plantae & Fungi" }]}
                      onChange={(value) => update("realmId", value)} />
                    <label className="catalog-create-field">
                      <span>{t(locale, "scientificName")}</span>
                      <input name="scientificName" className="planning-input" value={form.scientificName} onChange={(event) => update("scientificName", event.target.value)} />
                    </label>
                    <label className="catalog-create-field">
                      <span>{t(locale, "phylum")}</span>
                      <input className="planning-input" value={form.phylum} onChange={(event) => update("phylum", event.target.value)} />
                    </label>
                    <label className="catalog-create-field">
                      <span>{t(locale, "className")}</span>
                      <input name="className" className="planning-input" value={form.className} onChange={(event) => update("className", event.target.value)} />
                    </label>
                {isEdit ? (
                  <>
                    {[
                      ["kingdom", "kingdom"], ["order", "order"], ["family", "family"], ["genus", "genus"],
                      ["rank", "rank"], ["iucnStatus", "iucnStatus"], ["geologicalPeriod", "geologicalPeriod"],
                      ["extinctionYear", "extinctionYear"], ["size", "size"], ["lifespan", "lifespan"],
                      ["imageSourceUrl", "imageSourceUrl"], ["imageLicense", "imageLicense"],
                      ["imageLicenseUrl", "imageLicenseUrl"], ["imageRightsStatus", "imageRightsStatus"],
                      ["youtubeUrl", "youtubeUrl"], ["videoTitle", "videoTitle"], ["sourceUrls", "sourceUrls"],
                      ["authoritativeTaxonId", "authoritativeTaxonId"],
                    ].map(([field, labelKey]) => (
                      <label className="catalog-create-field" key={field}>
                        <span>{t(locale, labelKey)}</span>
                        <input className="planning-input" value={form[field]} onChange={(event) => update(field, event.target.value)} />
                      </label>
                    ))}
                    {[
                      ["descriptionEn", "descriptionEn"], ["habitatEn", "habitatEn"],
                      ["distributionEn", "distributionEn"], ["dietEn", "dietEn"],
                    ].map(([field, labelKey]) => (
                      <label className="catalog-create-field catalog-create-field-wide" key={field}>
                        <span>{t(locale, labelKey)}</span>
                        <textarea className="planning-input" rows="3" value={form[field]} onChange={(event) => update(field, event.target.value)} />
                      </label>
                    ))}
                    <label className="catalog-create-field catalog-create-checkbox">
                      <input type="checkbox" checked={form.isDangerous} onChange={(event) => update("isDangerous", event.target.checked)} />
                      <span>{t(locale, "dangerous")}</span>
                    </label>
                  </>
                ) : null}
                  </div>
                </details>
              </div>
              <div className="catalog-create-server-error" role="status" aria-live="polite">{error}</div>
            </div>
            
            <aside className="catalog-create-preview-column">
              <span className="catalog-create-preview-label">{t(locale, "livePreview")}</span>
              <div className="catalog-create-preview preview-games" aria-label={t(locale, "cardPreview")}>
                <div className="catalog-create-preview-cover">
                  {previewSrc && !imgError ? (
                    <img src={previewSrc} alt="" onError={() => setImgError(true)} />
                  ) : (
                    <span>{form.realmId === "plantae_fungi" ? "Plantae" : (form.realmId === "animalia" ? "Animalia" : "Organism")}</span>
                  )}
                </div>
                <div className="catalog-create-preview-meta">
                  <strong>{form.commonNameEn || t(locale, "unknownSpecies")}</strong>
                  <span>{form.scientificName.trim() || form.className || t(locale, "noCommonName")}</span>
                </div>
              </div>
            </aside>
          </div>

          <footer className="catalog-create-actions">
            <button type="button" className="btn" onClick={requestClose} disabled={saving || processingCover}>{t(locale, "cancel")}</button>
            <button type="submit" className="btn btn-primary" disabled={saving || processingCover}>
              {saving ? t(locale, "saving") : processingCover ? t(locale, "processingImage") : t(locale, isEdit ? "saveChanges" : "addToMuseum")}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
