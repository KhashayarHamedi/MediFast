"use client";

import { SeniorModeProvider } from "@/components/senior-mode-provider";
import { ConsentModal } from "@/components/consent-modal";

/**
 * Wraps app with consent modal (first load) and senior mode state.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SeniorModeProvider>
      {children}
      <ConsentModal />
    </SeniorModeProvider>
  );
}
