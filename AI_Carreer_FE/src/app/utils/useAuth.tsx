import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type User = {
  username: string;
  displayName: string;
  isPremium: boolean;
};

// Hard-coded accounts
const ACCOUNTS: Record<string, { password: string; user: User }> = {
  user: {
    password: "user123",
    user: { username: "user", displayName: "Nguyễn Văn A", isPremium: false },
  },
  premium: {
    password: "premium123",
    user: { username: "premium", displayName: "Trần Thị B", isPremium: true },
  },
};

type AuthContextValue = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const login = useCallback((username: string, password: string): boolean => {
    const account = ACCOUNTS[username.toLowerCase()];
    if (!account || account.password !== password) return false;
    setUser(account.user);
    localStorage.setItem("authUser", JSON.stringify(account.user));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authUser");
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
