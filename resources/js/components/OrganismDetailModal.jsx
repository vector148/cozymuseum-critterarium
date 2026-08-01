import { useEffect, useMemo, useState } from "react";

import { t } from "../i18n.js";

function youtubeId(item) {
  if (item.youtubeId) return item.youtubeId;
  const value = String(item.youtubeUrl || "");
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    return url.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/)?.[1] || "";
  } catch {
    return "";
  }
}

function InfoCell({ label, value, italic = false }) {
  if (!value) return null;
  return (
    <div className="cell">
      <div className="k">{label}</div>
      <div className="v">{italic ? <i>{value}</i> : value}</div>
    </div>
  );
}

export default function OrganismDetailModal({ item, locale, realmLabel, onClose, onComplete, onUndo }) {
  const [completing, setCompleting] = useState(false);
  const [rarityScore, setRarityScore] = useState("");
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);
  const videoId = useMemo(() => youtubeId(item), [item]);
  const image = item.coverUrl;

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function complete() {
    const score = Number(rarityScore);
    if (rarityScore === "" || !Number.isFinite(score) || score < 0 || score > 10) {
      setValidationError(t(locale, "invalidRarity"));
      return;
    }
    setSaving(true);
    setValidationError("");
    try {
      await onComplete(score);
      setCompleting(false);
      setRarityScore("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={item.displayName}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content glass-card deep organism-detail" onClick={(event) => event.stopPropagation()}>
        <button className="close-btn" type="button" onClick={onClose} aria-label={t(locale, "close")}>×</button>

        <div className="detail-hero organism-detail-hero">
          {image ? <img className="organism-detail-image" src={image} alt={item.displayName} /> : null}
          <div className="big-title">{item.displayName}</div>
          <div className="sub"><i>{item.scientificName}</i></div>
          <div className="timeline">
            <span className="step">{item.displayPhylum}</span>
            {item.className ? (
              <>
                <span className="sep">·</span>
                <span>{item.className}</span>
              </>
            ) : null}
            {item.encountered ? (
              <>
                <span className="sep">·</span>
                <span>{t(locale, "encountered")}: {item.encounterDate}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="info-grid detail-info-grid">
          <InfoCell label="Realm" value={realmLabel} />
          <InfoCell label={t(locale, "phylum")} value={item.displayPhylum} />
          <InfoCell label={t(locale, "className")} value={item.className} />
          <InfoCell label={t(locale, "order")} value={item.order} />
          <InfoCell label={t(locale, "family")} value={item.family} />
          <InfoCell label={t(locale, "lifeState")} value={item.lifeState === "extinct" ? t(locale, "extinctStatus") : t(locale, "extantStatus")} />
          <InfoCell label={t(locale, "conservation")} value={item.iucnStatus} />
          <InfoCell label={t(locale, "period")} value={[item.geologicalPeriod, item.extinctionYear].filter(Boolean).join(" · ")} />
          <InfoCell label={t(locale, "habitat")} value={item.displayHabitat} />
          <InfoCell label={t(locale, "distribution")} value={item.displayDistribution} />
          <InfoCell label={t(locale, "diet")} value={item.displayDiet} />
          <InfoCell label={t(locale, "size")} value={item.size} />
          <InfoCell label={t(locale, "lifespan")} value={item.lifespan} />
        </div>

        {item.displayDescription ? <div className="organism-description">{item.displayDescription}</div> : null}

        {item.lifeState === "extant" && item.encounterEnabled !== false ? (
          <div className="encounter-panel glass-card">
            {!item.encountered && !completing ? (
              <button className="completion-toggle" type="button" onClick={() => setCompleting(true)}>
                <span className="completion-dot" />
                {t(locale, "markEncountered")}
              </button>
            ) : !item.encountered ? (
              <div className="completion-confirm">
                <input
                  className="score-input"
                  autoFocus
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rarityScore}
                  onChange={(event) => {
                    setRarityScore(event.target.value);
                    setValidationError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") complete();
                    if (event.key === "Escape") setCompleting(false);
                  }}
                  placeholder={t(locale, "rarityPrompt")}
                  aria-invalid={Boolean(validationError)}
                />
                <button className="btn btn-primary" type="button" disabled={saving} onClick={complete}>
                  {t(locale, "confirmEncounter")}
                </button>
                <button className="btn" type="button" onClick={() => setCompleting(false)}>{t(locale, "close")}</button>
                {validationError ? <span className="score-error">{validationError}</span> : null}
              </div>
            ) : (
              <div className="encounter-complete-row">
                <div>
                  <span>{t(locale, "encountered")}: <strong>{item.encounterDate}</strong></span>
                  <span>{t(locale, "rarity")}: <strong>{Number(item.rarityScore).toFixed(1)}</strong></span>
                </div>
                <button className="btn" type="button" disabled={saving} onClick={onUndo}>{t(locale, "undoEncounter")}</button>
              </div>
            )}
          </div>
        ) : null}

        {videoId ? (
          <div className="trailer-section">
            <div className="trailer-header">{t(locale, "video")}</div>
            <div className="trailer-iframe-wrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={item.videoTitle || item.displayName}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="trailer-actions">
              <a className="btn" href={item.youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">
                {t(locale, "watchYoutube")}
              </a>
            </div>
          </div>
        ) : <div className="empty-state detail-empty-state">{t(locale, "noVideo")}</div>}

        {item.sourceUrls ? (
          <div className="organism-source">
            <span>{t(locale, "source")}</span>
            <a href={String(item.sourceUrls).split(/[|,;]/)[0]} target="_blank" rel="noreferrer">
              {String(item.sourceUrls).split(/[|,;]/)[0]}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
