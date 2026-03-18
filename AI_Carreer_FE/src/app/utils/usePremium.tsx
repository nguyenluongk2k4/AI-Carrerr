import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./useAuth";

type PremiumContextValue = {
  isPremium: boolean;
  activate: () => void;
  deactivate: () => void;
};

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // activate/deactivate are no-ops now — premium is driven by the logged-in account
  const value = useMemo<PremiumContextValue>(
    () => ({
      isPremium: user?.isPremium ?? false,
      activate: () => {},
      deactivate: () => {},
    }),
    [user]
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within PremiumProvider");
  return ctx;
}
