import { useEffect, useState } from "react";

import Toast from "./components/Toast.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { useAtlas } from "./hooks/useAtlas.js";
import { availableAtlasModes, REALMS, realmName, t } from "./i18n.js";
import Atlas from "./pages/Atlas.jsx";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.86 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.46-.35-.19-.85-.66-.01-.67.79-.01 1.35.75 1.54 1.06.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.25 9.25 0 0 1 12 6.97c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function MediaCollectionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#FFDD00" />
      <path d="M4.8 7.2h5.1v4.6H4.8zM6 8.35v2.25m-1.12-1.13h2.25m1.35-.12h.01m-.01 1.25h.01" stroke="#111" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.1 7.1h5.1v4.8h-5.1zM14.1 8.3h5.1M15.1 7.1v1.2m3.1-1.2v1.2m-3.1 2.4v1.2m3.1-1.2v1.2" stroke="#111" strokeWidth="1.05" strokeLinejoin="round" />
      <path d="m5.4 15 3.5 2.15-3.5 2.15z" fill="#111" />
      <path d="M17.7 14.5v4.1a1.28 1.28 0 1 1-.95-1.24V15.4l2.45-.62v3.2a1.28 1.28 0 1 1-.95-1.24V14.3z" fill="#111" />
    </svg>
  );
}

function AppInner() {
  const {
    realmId, switchRealm, atlasMode, switchMode, locale, setLocale,
    query, phylumId, classId, encounterYear,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const data = useAtlas({ realmId, atlasMode, locale, query, phylumId, classId, encounterYear });

  useEffect(() => {
    document.documentElement.className = `theme-bio-${realmId}`;
  }, [realmId]);

  const encounterEnabled = data.metadata.realms.find((realm) => realm.id === realmId)?.encounterEnabled === true;

  useEffect(() => {
    if (!encounterEnabled && atlasMode === "hall_of_fame") switchMode("living");
  }, [atlasMode, encounterEnabled, switchMode]);

  const modeDefinitions = [
    { id: "living", icon: "◆", label: t(locale, "living") },
    { id: "retired", icon: "✦", label: t(locale, "retired") },
    { id: "hall_of_fame", icon: "★", label: t(locale, "hall_of_fame") },
  ];
  const modes = availableAtlasModes(encounterEnabled)
    .map((modeId) => modeDefinitions.find((mode) => mode.id === modeId));

  return (
    <div id="app">
      <button
        className={`mobile-menu-btn ${sidebarOpen ? "active" : ""}`}
        type="button"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo"><span className="logo-text">CozyMuseum</span></div>
          <button className="collapse-btn" type="button" onClick={() => setSidebarCollapsed((value) => !value)} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Atlas areas">
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`nav-item ${atlasMode === mode.id ? "active" : ""}`}
              type="button"
              onClick={() => {
                switchMode(mode.id);
                setSidebarOpen(false);
              }}
            >
              <span className="icon">{mode.icon}</span>
              <span className="nav-label">{mode.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="locale-switch glass-card" aria-label="Language">
            {["en", "vi"].map((language) => (
              <button
                key={language}
                type="button"
                className={locale === language ? "active" : ""}
                aria-pressed={locale === language}
                onClick={() => setLocale(language)}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="realm-tab-grid">
            {REALMS.map((realm) => (
              <button
                key={realm.id}
                className={`realm-tab-btn realm-tab-${realm.id} ${realmId === realm.id ? "active" : ""}`}
                type="button"
                onClick={() => switchRealm(realm.id)}
              >
                <span className="realm-tab-icon">{realm.icon}</span>
                <span className="realm-tab-label">{realmName(realm, locale)}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-links">
            <div className="museum-invite">
              <p className="museum-invite-title">{t(locale, "museumInvite")}</p>
              <div className="museum-choice-grid">
              <a className="museum-choice github-choice" href="https://github.com/vector148/cozymuseum" target="_blank" rel="noopener noreferrer">
                <span className="museum-cta-icon"><GitHubIcon /></span>
                <span className="museum-cta-copy">
                  <strong>{t(locale, "museumCtaTitle")}</strong>
                </span>
                <span className="museum-cta-arrow">→</span>
              </a>
              <a className="museum-choice media-museum-choice" href="https://buymeacoffee.com/vector148/e/562244" target="_blank" rel="noopener noreferrer">
                <span className="museum-cta-icon media"><MediaCollectionIcon /></span>
                <span className="museum-cta-copy">
                  <strong>{t(locale, "mediaMuseumCtaTitle")}</strong>
                </span>
                <span className="museum-cta-arrow">→</span>
              </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Atlas data={data} />
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
