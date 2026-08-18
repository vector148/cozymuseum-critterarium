import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "./api/index.js";
import OrganismCard from "./components/OrganismCard.jsx";
import OrganismDetailModal from "./components/OrganismDetailModal.jsx";
import CritterariumAddCard from "./components/CritterariumAddCard.jsx";
import { OptimizedImage } from "../../components/OptimizedImage.jsx";
import { useApp } from "../../context/AppContext.jsx";
import { WINGS, wingName, t } from "../../i18n.js";
import { useSEO } from "../../support/seo/useSEO.js";
import { siteHref } from "../../routing/site-route.js";
import { catalogMediaFor } from "./media/catalog-media.js";

// Map cozy category → pill color class (mirrors Curatale PILL_COLOR)
const CLASS_PILL_COLOR = {
  fishes: "blue", sharks: "blue", corals: "blue", mollusks: "blue",
  crustaceans: "blue", echinoderms: "blue", jellyfish: "blue", marine: "blue",
  mammals: "green", birds: "green", reptiles: "green",
  amphibians: "green", insects: "green", arachnids: "green",
  myriapods: "green", annelids: "green",
  trees: "green", flowers: "green", fungi: "yellow",
  microbes: "purple", algae: "green",
};

function rankingPillColor(displayClass) {
  const key = String(displayClass || "").toLowerCase().split(" ")[0];
  return CLASS_PILL_COLOR[key] || "blue";
}

function Controls({ metadata, sidebarOpen, mobileChromeHidden, onMenuClick }) {
  const {
    critterariumMode, locale, query, setQuery,
    classId, setClassId, encounterYear, setEncounterYear,
  } = useApp();
  const classes = metadata?.categories || [];

  useEffect(() => {
    if (classId !== "all" && !classes.some((c) => c.id === classId)) setClassId("all");
  }, [classes, classId, setClassId]);

  // Hall of Fame has its own integrated filter header — hide the Controls bar
  if (critterariumMode === "hall_of_fame") return null;

  return (
    <div className={`controls glass-card critterarium-controls ${mobileChromeHidden ? "hidden" : ""}`}>
      <div className="critterarium-search-row">
        <button
          className={`mobile-menu-btn ${sidebarOpen ? "active" : ""}`}
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
        <div className="search-box glass-input">
          <input
            type="search"
            placeholder={t(locale, "search")}
            aria-label={t(locale, "search")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
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

function HallOfFame({ items, metadata, locale, onOpen, sidebarOpen, onMenuClick, emptyCopy }) {
  const { classId, setClassId, encounterYear, setEncounterYear } = useApp();
  const classes = (metadata?.categories || []).filter((classItem) => Number(classItem.count) > 0);
  const years = (metadata?.encounterYears || []).map(String).sort((a, b) => Number(b) - Number(a));
  const latestYear = years[0] || "all";

  useEffect(() => {
    if (encounterYear === "latest" && latestYear !== "all") setEncounterYear(latestYear);
  }, [encounterYear, latestYear, setEncounterYear]);

  useEffect(() => {
    if (classId !== "all" && !classes.some((c) => c.id === classId)) setClassId("all");
  }, [classes, classId, setClassId]);

  return (
    <>
      <header className="great-hall-mobile-bar hall-of-fame-mobile-bar">
        <button className={`mobile-menu-btn ${sidebarOpen ? "active" : ""}`} type="button" onClick={onMenuClick} aria-label="Open museum navigation">
          <span /><span /><span />
        </button>
        <div className="hall-of-fame-mobile-copy">
          <strong>{t(locale, "rankTitle")}</strong>
          <span>{items.length} {t(locale, "rankedCount")}</span>
        </div>
      </header>
      {/* Curatale-style header: title + count on left, chips + year dropdown on right */}
      <div className="ranking-head">
        <div className="ranking-head-left">
          <h2>{t(locale, "rankTitle")}</h2>
          <span className="ranking-count">{items.length} {t(locale, "rankedCount")}</span>
        </div>
        <div className="ranking-filters">
          <div className="ranking-filter-scroll">
            <div className="filter-chips">
            <button
              className={`chip ${classId === "all" ? "active" : ""}`}
              type="button"
              onClick={() => setClassId("all")}
            >
              {t(locale, "allCategories")}
            </button>
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                className={`chip realm-chip ${classId === classItem.id ? "active" : ""}`}
                type="button"
                onClick={() => setClassId(classId === classItem.id ? "all" : classItem.id)}
              >
                <span className="dot accent" />{classItem.label}
              </button>
            ))}
            </div>
          </div>
          <select
            className="ranking-year-select"
            value={encounterYear === "latest" ? latestYear : encounterYear}
            onChange={(event) => setEncounterYear(event.target.value)}
            aria-label={t(locale, "allYears")}
          >
            <option value="all">{t(locale, "allYears")}</option>
            {(metadata.encounterYears || []).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>


      {items.length ? (
        <div className="ranking-list">
          {items.map((item, index) => {
            const color = rankingPillColor(item.displayClass);
            const media = catalogMediaFor(item.organismId, item.coverUrl);
            return (
              <button
                className="ranking-row"
                type="button"
                key={item.organismId}
                onClick={(event) => onOpen(item, event.currentTarget)}
              >
                <span className="rank-no">#{index + 1}</span>
                <span className="ranking-thumb">
                  {media.src ? (
                    <OptimizedImage
                      src={media.src}
                      fallbackSrc={media.fallbackSrc}
                      width={128}
                      quality={60}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling.style.display = "grid";
                      }}
                    />
                  ) : null}
                  <span className="ranking-image-fallback" style={media.src ? { display: "none" } : undefined}>◇</span>
                </span>
                <span className="rank-title">
                  {item.displayName}{item.isDangerous ? " ☠️" : ""}
                  <small>
                    <span className={`ranking-pill ranking-pill--${color}`}>{item.displayClass}</span>
                    {" "}{item.encounterDate}
                  </small>
                </span>
                <span className="rank-score">{Number(item.rarityScore).toFixed(1)}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="critterarium-state" style={{ marginTop: '4rem' }}>{emptyCopy}</div>
      )}
      <p className="ranking-disclaimer" style={{ marginTop: '20px', textAlign: 'center' }}><small><i>{t(locale, "personalDisclaimer")}</i></small></p>
    </>
  );
}

export default function Critterarium({ data, sidebarOpen, mobileChromeHidden, onMenuClick }) {
  const { wingId, critterariumMode, locale, showToast } = useApp();
  const [detail, setDetail] = useState(null);
  const detailTriggerRef = useRef(null);
  const clientWing = useMemo(() => WINGS.find((wing) => wing.id === wingId), [wingId]);
  const [visibleCount, setVisibleCount] = useState(16);

  const isHallOfFame = critterariumMode === "hall_of_fame";
  const seoTitle = isHallOfFame
    ? "Hall of Fame — Curated Nature Highlights | CozyMuseum"
    : "Critterarium | A Real-Life Nature Collection";

  const canonicalUrl = siteHref({ mode: isHallOfFame ? "fame" : "critterarium" });

  const jsonLd = useMemo(() => {
    if (isHallOfFame && data.items.length) {
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Nature Hall of Fame — CozyMuseum",
        "description": "A personal ranked list of wildlife encounters, ordered by rarity score.",
        "url": canonicalUrl,
        "numberOfItems": data.items.length,
        "itemListElement": data.items.slice(0, 10).map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.commonNameEn || item.scientificName,
          "description": item.className || item.scientificName,
        })),
      };
    }
    if (!isHallOfFame) {
      return {
        "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Critterarium",
      "description": "A public, source-linked organism catalogue with a browser-local encounter layer.",
      "url": canonicalUrl,
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Web",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      };
    }
    return null;
  }, [isHallOfFame, data.items, canonicalUrl]);

  useSEO({
    title: seoTitle,
    description: isHallOfFame
      ? "Discover the highest-ranked wildlife encounters in the CozyMuseum Critterarium, ordered by rarity score."
      : "Explore a public, source-linked organism catalogue and keep browser-local encounters without a social feed or automatic identification.",
    url: canonicalUrl,
    jsonLd,
    locale,
  });

  useEffect(() => {
    setVisibleCount(16);
  }, [wingId, critterariumMode, data.items]);

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

  const emptyCopy = critterariumMode === "retired"
    ? t(locale, "emptyRetired")
    : critterariumMode === "hall_of_fame" ? t(locale, "emptyHall") : t(locale, "emptyLiving");

  return (
    <>
      <header className="critterarium-answer" aria-labelledby="critterarium-title" style={{ display: "none" }}>
        <h1 id="critterarium-title">Critterarium</h1>
        <p data-answer-contract="direct-answer">
          {locale === "vi"
            ? "Critterarium là một nhật ký thiên nhiên offline: bạn khám phá danh mục sinh vật có nguồn và giữ lại những lần chạm trán ngay trên trình duyệt, không có bảng tin xã hội hay nhận diện tự động."
            : "Critterarium is an offline nature journal: explore a sourced organism catalogue and keep the encounters you choose in your browser, without a social feed or automatic identification."}
        </p>
      </header>
      <Controls metadata={data.metadata} sidebarOpen={sidebarOpen} mobileChromeHidden={mobileChromeHidden} onMenuClick={onMenuClick} />
      {data.loading ? <div className="critterarium-state">{t(locale, "loading")}</div> : null}
      {data.error ? <div className="critterarium-state is-error">{data.error}</div> : null}
      {critterariumMode === "hall_of_fame" && !data.loading && !data.error ? (
        <HallOfFame items={data.items} metadata={data.metadata} locale={locale} onOpen={openDetail} sidebarOpen={sidebarOpen} onMenuClick={onMenuClick} emptyCopy={emptyCopy} />
      ) : null}
      {!data.loading && !data.error && !data.items.length && critterariumMode !== "hall_of_fame" ? (
        <div className="grid">
          <CritterariumAddCard locale={locale} onCreated={data.refresh} />
        </div>
      ) : null}
      {!data.loading && !data.error && data.items.length && critterariumMode !== "hall_of_fame" ? (
        <>
          <div className="grid">
            {data.items.slice(0, visibleCount).map((item) => (
              <OrganismCard key={item.organismId} item={item} mode={critterariumMode} onOpen={openDetail} />
            ))}
            <CritterariumAddCard locale={locale} onCreated={data.refresh} />
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
