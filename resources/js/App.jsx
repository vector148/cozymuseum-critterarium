import { useEffect, useState } from "react";

import Toast from "./components/Toast.jsx";
import MuseumNavIcon from "./components/MuseumNavIcon.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { useAtlas } from "./hooks/useAtlas.js";
import { WINGS, wingName, t } from "./i18n.js";
import Atlas from "./pages/Atlas.jsx";
import { shellNavigation } from "./shell-surface.js";

function AppInner() {
  const {
    wingId, switchWing, atlasMode, switchMode, locale, setLocale,
    query, classId, encounterYear,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const data = useAtlas({ wingId, atlasMode, locale, query, classId, encounterYear });

  useEffect(() => {
    document.documentElement.className = `theme-wing-${wingId}`;
  }, [wingId]);

  const encounterEnabled = wingId !== "fossils";
  useEffect(() => {
    if (!encounterEnabled && atlasMode === "hall_of_fame") switchMode("living");
  }, [atlasMode, encounterEnabled, switchMode]);

  const modes = shellNavigation({ encounterEnabled });

  return (
    <div id="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header museum-brand-lockup">
          <div className="brand-identity" aria-label="CozyMuseum Critterarium">
            <img className="brand-symbol" src="/brand/cozymuseum-sidebar-logo.svg" alt="" aria-hidden="true" />
            <span className="brand-wordmark">CozyMuseum</span>
          </div>
          <button
            className="collapse-btn"
            type="button"
            onClick={() => window.innerWidth <= 768 ? setSidebarOpen(false) : setSidebarCollapsed((value) => !value)}
            aria-label={locale === "vi" ? "Thu gọn điều hướng" : "Toggle navigation"}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label={locale === "vi" ? "Khu vực bảo tàng" : "Museum areas"}>
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
              <span className="icon"><MuseumNavIcon name={mode.icon} /></span>
              <span className="nav-label">{t(locale, mode.labelKey)}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="locale-switch glass-card" aria-label="Language">
            {["en", "vi"].map((language) => (
              <button key={language} type="button" className={locale === language ? "active" : ""} aria-pressed={locale === language} onClick={() => setLocale(language)}>
                {language.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="realm-tab-grid">
            {WINGS.map((wing) => (
              <button key={wing.id} className={`realm-tab-btn realm-tab-${wing.id} ${wingId === wing.id ? "active" : ""}`} type="button" onClick={() => switchWing(wing.id)}>
                <span className="realm-tab-icon">{wing.icon}</span>
                <span className="realm-tab-label">{wingName(wing, locale)}</span>
              </button>
            ))}
          </div>

          <p className="local-data-notice">{locale === "vi" ? "Dữ liệu nằm trên máy của bạn." : "Your data stays on this computer."}</p>
        </div>
      </aside>

      <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Atlas data={data} sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen((open) => !open)} />
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
