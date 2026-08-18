import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { critterariumSearchTerm } from "../routing/critterarium-search.js";

const AppContext = createContext(null);

function initialLocale() {
  try {
    return localStorage.getItem("cozymuseum-locale") === "vi" ? "vi" : "en";
  } catch {
    return "en";
  }
}

function initialQuery() {
  return typeof window === "undefined" ? "" : critterariumSearchTerm(window.location.search);
}

export function AppProvider({ children }) {
  const [wingId, setWingId] = useState("aquarium");
  const [critterariumMode, setcritterariumMode] = useState("living");
  const [locale, setLocale] = useState(initialLocale);
  const [query, setQuery] = useState(initialQuery);
  const [classId, setClassId] = useState("all");
  // Resolve the newest available year when Hall of Fame metadata arrives.
  const [encounterYear, setEncounterYear] = useState("latest");
  const [toast, setToast] = useState({ msg: "", show: false });
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem("cozymuseum-locale", locale);
    } catch {
      // Browsing remains functional when localStorage is unavailable.
    }
  }, [locale]);

  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, show: false })), 2600);
  }, []);

  const switchWing = useCallback((nextWing) => {
    setWingId(nextWing);
    setClassId("all");
    setEncounterYear("latest");
  }, []);

  const switchMode = useCallback((nextMode) => {
    setcritterariumMode(nextMode);
    setClassId("all");
    setEncounterYear("latest");
  }, []);

  return (
    <AppContext.Provider value={{
      wingId, switchWing,
      critterariumMode, switchMode,
      atlasMode: critterariumMode,
      locale, setLocale,
      query, setQuery,
      classId, setClassId,
      encounterYear, setEncounterYear,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}
