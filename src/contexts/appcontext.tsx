"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

export interface AppContextState {
  user?: { username: string | null };
  theme?: "light" | "dark";
  [key: string]: any;
}

interface AppContextType {
  state: AppContextState;
  setState: Dispatch<SetStateAction<AppContextState>>;
  setSlice: <K extends keyof AppContextState>(
    key: K,
    value: AppContextState[K]
  ) => void;
  clear: () => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppContextState>({
    theme: "dark",
  });

  const setSlice = <K extends keyof AppContextState>(
    key: K,
    value: AppContextState[K]
  ) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clear = () => setState({ theme: state.theme ?? "dark" });

  const setTheme = (theme: "light" | "dark") => {
    setSlice("theme", theme);
  };

  const toggleTheme = () => {
    setTheme((state.theme ?? "dark") === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (state.theme) return; // if already set
    if (typeof window === "undefined") return;

    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Sync theme to <html data-theme="...">
  useEffect(() => {
    if (typeof document === "undefined") return;
    const theme = state.theme ?? "dark";
    document.documentElement.dataset.theme = theme;
  }, [state.theme]);


  return (
    <AppContext.Provider
      value={{ state, setState, setSlice, clear, setTheme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
  return ctx;
}
