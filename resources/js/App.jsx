import { useEffect, useState } from "react";

import Toast from "./components/Toast.jsx";
import MuseumNavIcon from "./components/MuseumNavIcon.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { useCritterarium } from "./modules/critterarium/hooks/useCritterarium.js";
import { WINGS, wingName, t } from "./i18n.js";
import Critterarium from "./modules/critterarium/Critterarium.jsx";
import { shellNavigation } from "./shell-surface.js";
import { useMobileScrollHide } from "./hooks/useMobileScrollHide.js";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#ffffff" d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.86 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.46-.35-.19-.85-.66-.01-.67.79-.01 1.35.75 1.54 1.06.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.25 9.25 0 0 1 12 6.97c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.69.49A10.13 10.13 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function CoffeeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '32px', height: '32px', display: 'block', backgroundColor: '#FFDD00', borderRadius: '8px', padding: '5px' }}>
      <path fill="#000000" d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
    </svg>
  );
}

function AppInner() {
  const {
    wingId, switchWing, atlasMode, switchMode, locale, setLocale,
    query, classId, encounterYear,
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mobileChromeHidden = useMobileScrollHide(sidebarOpen);
  const data = useCritterarium({ wingId, atlasMode, locale, query, classId, encounterYear });

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
        <div className="museum-brand-lockup">
          <a className="brand-identity" href="/" aria-label="CozyMuseum home">
            <img className="brand-symbol" src="/brand/cozymuseum-sidebar-logo.svg" alt="" aria-hidden="true" />
            <span className="brand-wordmark">CozyMuseum</span>
          </a>
          <button
            className="locale-header-btn"
            type="button"
            onClick={() => setLocale(locale === "en" ? "vi" : "en")}
            aria-label={locale === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"}
            title={locale === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"}
          >
            <span className="locale-code">{locale.toUpperCase()}</span>
          </button>
          <button
            className="collapse-btn desktop-collapse-btn"
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={sidebarCollapsed ? (locale === "vi" ? "Mở thanh điều hướng" : "Expand navigation") : (locale === "vi" ? "Thu gọn thanh điều hướng" : "Collapse navigation")}
            aria-expanded={!sidebarCollapsed}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <button
            className="mobile-menu-btn mobile-sidebar-close active"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label={locale === "vi" ? "Đóng điều hướng bảo tàng" : "Close museum navigation"}
          >
            <span />
            <span />
            <span />
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
        
        <button
          className="locale-switch-collapsed"
          type="button"
          onClick={() => setLocale(locale === "en" ? "vi" : "en")}
          aria-label={locale === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"}
          title={locale === "en" ? "Chuyển sang tiếng Việt" : "Switch to English"}
        >
          <span className="locale-code">{locale.toUpperCase()}</span>
        </button>

        <div className="sidebar-footer">
          <div className="realm-tab-grid">
            {WINGS.map((wing) => (
              <button key={wing.id} className={`realm-tab-btn realm-tab-${wing.id} ${wingId === wing.id ? "active" : ""}`} type="button" onClick={() => switchWing(wing.id)}>
                <span className="realm-tab-icon">{wing.icon}</span>
                <span className="realm-tab-label">{wingName(wing, locale)}</span>
              </button>
            ))}
          </div>
          
          <div className="sidebar-links">
            <div className="sidebar-icon-row">
              <a className="sidebar-icon-btn github" href="https://github.com/vector148/cozymuseum-critterarium/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a className="sidebar-icon-btn coffee" href="https://buymeacoffee.com/vector148/extras" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee">
                <CoffeeIcon />
              </a>
            </div>
            <span className="sidebar-license">Personal Use · Vector148</span>
          </div>
        </div>
      </aside>

      <div className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      <main className={`main-content ${sidebarCollapsed ? "collapsed" : ""}`}>
        <Critterarium data={data} sidebarOpen={sidebarOpen} mobileChromeHidden={mobileChromeHidden} onMenuClick={() => setSidebarOpen((open) => !open)} />
      </main>
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
