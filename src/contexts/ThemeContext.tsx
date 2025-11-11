import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  darkMode: boolean;
  compactView: boolean;
  toggleDarkMode: () => void;
  toggleCompactView: () => void;
  setDarkMode: (value: boolean) => void;
  setCompactView: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [compactView, setCompactViewState] = useState(() => {
    const saved = localStorage.getItem("compactView");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (compactView) {
      document.body.classList.add("compact-view");
    } else {
      document.body.classList.remove("compact-view");
    }
    localStorage.setItem("compactView", JSON.stringify(compactView));
  }, [compactView]);

  const toggleDarkMode = () => setDarkModeState(!darkMode);
  const toggleCompactView = () => setCompactViewState(!compactView);
  const setDarkMode = (value: boolean) => setDarkModeState(value);
  const setCompactView = (value: boolean) => setCompactViewState(value);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        compactView,
        toggleDarkMode,
        toggleCompactView,
        setDarkMode,
        setCompactView,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
