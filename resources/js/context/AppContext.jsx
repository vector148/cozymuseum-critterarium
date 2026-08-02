import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const AppContext = createContext(null);

function initialLocale() {
  try {
    return localStorage.getItem("cozymuseum-locale") === "vi" ? "vi" : "en";
  } catch {
    return "en";
  }
}

export function AppProvider({ children }) {
  const [wingId, setWingId] = useState("aquarium");
  const [atlasMode, setAtlasMode] = useState("living");
  const [locale, setLocale] = useState(initialLocale);
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("all");
  const [encounterYear, setEncounterYear] = useState("all");
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
    setEncounterYear("all");
  }, []);

  const switchMode = useCallback((nextMode) => {
    setAtlasMode(nextMode);
    setClassId("all");
    setEncounterYear(nextMode === "hall_of_fame" ? "auto" : "all");
  }, []);

  return (
    <AppContext.Provider value={{
      wingId, switchWing,
      atlasMode, switchMode,
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
