"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "medifast_senior_mode";

type SeniorContext = {
  enabled: boolean;
  toggle: () => void;
};

const SeniorContext = createContext<SeniorContext | null>(null);

export function useSeniorMode() {
  const ctx = useContext(SeniorContext);
  return ctx ?? { enabled: false, toggle: () => {} };
}

export function SeniorModeProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(STORAGE_KEY);
    setEnabled(v === "1");
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
        document.documentElement.classList.toggle("senior-mode", next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("senior-mode", enabled);
  }, [enabled]);

  return (
    <SeniorContext.Provider value={{ enabled, toggle }}>
      {children}
    </SeniorContext.Provider>
  );
}
