import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "../api/index.js";
import OrganismCard from "../components/OrganismCard.jsx";
import OrganismDetailModal from "../components/OrganismDetailModal.jsx";
import { useApp } from "../context/AppContext.jsx";
import { WINGS, wingName, t } from "../i18n.js";

function Controls({ metadata }) {
  const {
    atlasMode, locale, query, setQuery,
    classId, setClassId, encounterYear, setEncounterYear,
  } = useApp();
  const classes = metadata?.categories || [];

  useEffect(() => {
    if (classId !== "all" && !classes.some((classItem) => classItem.id === classId)) setClassId("all");
  }, [classes, classId, setClassId]);

  useEffect(() => {
    if (atlasMode !== "hall_of_fame" || encounterYear !== "auto") return;
    const currentYear = String(new Date().getFullYear());
    setEncounterYear(metadata.encounterYears?.includes(currentYear) ? currentYear : "all");
  }, [atlasMode, encounterYear, metadata.encounterYears, setEncounterYear]);

  return (
    <div className="controls glass-card atlas-controls">
      <div className="atlas-search-row">
        <div className="search-box glass-input">
          <input
            type="search"
            placeholder={t(locale, "search")}
            aria-label={t(locale, "search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {atlasMode === "hall_of_fame" ? (
          <select
            className="atlas-year-select glass-input"
            value={encounterYear === "auto" ? "all" : encounterYear}
            onChange={(event) => setEncounterYear(event.target.value)}
            aria-label={t(locale, "allYears")}
          >
            <option value="all">{t(locale, "allYears")}</option>
            {(metadata.encounterYears || []).map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        ) : null}
      </div>

      <div className="taxonomy-row class-row">
        <div className="filter-chips">
          <button className={`chip ${classId === "all" ? "active" : ""}`} type="button" onClick={() => setClassId("all")}>
            {t(locale, "allCategories")}
          </button>
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              className={`chip realm-chip ${classId === classItem.id ? "active" : ""}`}
              type="button"
              onClick={() => setClassId(classItem.id)}
            >
              <span className="dot accent" />{classItem.label}<span className="chip-count">{classItem.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HallOfFame({ items, locale, onOpen }) {
  return (
    <section className="ranking-panel glass-card">
      <div className="ranking-head">
        <div>
          <h2>{t(locale, "rankTitle")}</h2>
          <span className="ranking-count">{items.length} {t(locale, "rankedCount")}</span>
        </div>
      </div>
      <div className="ranking-list">
        {items.map((item, index) => (
          <button className="ranking-row" type="button" key={item.organismId} onClick={(event) => onOpen(item, event.currentTarget)}>
            <span className="rank-no">#{index + 1}</span>
            {item.coverUrl
              ? <img src={item.coverUrl} alt="" />
              : <span className="ranking-image-fallback">◇</span>}
            <span className="rank-title">{item.displayName}<small><i>{item.scientificName}</i> · {item.encounterDate}</small></span>
            <span className="rank-score">{Number(item.rarityScore).toFixed(1)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function Atlas({ data }) {
  const { wingId, atlasMode, locale, showToast } = useApp();
  const [detail, setDetail] = useState(null);
  const detailTriggerRef = useRef(null);
  const clientWing = useMemo(() => WINGS.find((wing) => wing.id === wingId), [wingId]);
  const [visibleCount, setVisibleCount] = useState(16);

  useEffect(() => {
    setVisibleCount(16);
  }, [wingId, atlasMode, data.items]);

  async function completeEncounter(score) {
    try {
      const updated = await api.completeEncounter(detail.organismId, score);
      setDetail((current) => ({ ...current, ...updated }));
      data.refresh();
      showToast(t(locale, "saved"));
    } catch (error) {
      showToast(error.message || t(locale, "requestFailed"));
      throw error;
    }
  }

  async function undoEncounter() {
    try {
      const updated = await api.undoEncounter(detail.organismId);
      setDetail((current) => ({ ...current, ...updated }));
      data.refresh();
      showToast(t(locale, "undone"));
    } catch (error) {
      showToast(error.message || t(locale, "requestFailed"));
    }
  }

  function openDetail(item, trigger) {
    detailTriggerRef.current = trigger;
    setDetail(item);
  }

  function closeDetail() {
    setDetail(null);
    requestAnimationFrame(() => {
      if (detailTriggerRef.current?.isConnected) detailTriggerRef.current.focus();
      detailTriggerRef.current = null;
    });
  }

  const emptyCopy = atlasMode === "retired"
    ? t(locale, "emptyRetired")
    : atlasMode === "hall_of_fame" ? t(locale, "emptyHall") : t(locale, "emptyLiving");

  return (
    <>
      <Controls metadata={data.metadata} />
      {data.loading ? <div className="atlas-state">{t(locale, "loading")}</div> : null}
      {data.error ? <div className="atlas-state is-error">{data.error}</div> : null}
      {!data.loading && !data.error && !data.items.length ? <div className="atlas-state">{emptyCopy}</div> : null}
      {!data.loading && !data.error && data.items.length && atlasMode === "hall_of_fame"
        ? <HallOfFame items={data.items} locale={locale} onOpen={openDetail} /> : null}
      {!data.loading && !data.error && data.items.length && atlasMode !== "hall_of_fame" ? (
        <>
          <div className="grid">
            {data.items.slice(0, visibleCount).map((item) => (
              <OrganismCard key={item.organismId} item={item} mode={atlasMode} onOpen={openDetail} />
            ))}
          </div>
          {visibleCount < data.items.length && (
            <div style={{ textAlign: "center", margin: "2rem 0 4rem 0" }}>
              <button className="btn" type="button" onClick={() => setVisibleCount((c) => c + 16)}>
                {t(locale, "loadMore")}
              </button>
            </div>
          )}
        </>
      ) : null}

      {detail ? (
        <OrganismDetailModal
          item={detail}
          locale={locale}
          realmLabel={wingName(clientWing, locale)}
          onClose={closeDetail}
          onComplete={completeEncounter}
          onUndo={undoEncounter}
        />
      ) : null}
    </>
  );
}
