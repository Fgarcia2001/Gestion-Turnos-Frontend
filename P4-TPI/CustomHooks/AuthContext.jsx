import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// ── JWT helpers ────────────────────────────────────────────────────────────────
const TOKEN_KEY = "auth_token";

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload));
    return {
      sub: json.sub,
      name: json.name,
      role: json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      businessId: json.BusinessId,
      branchId: json.BranchId,
      exp: json.exp,
    };
  } catch {
    return null;
  }
};

const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return false; // no exp claim → treat as valid
  return Date.now() >= decoded.exp * 1000;
};

// ── Provider ───────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return null;
    const decoded = decodeJwt(saved);
    return decoded && !isTokenExpired(decoded) ? decoded : null;
  });

  // Sync user state whenever the token changes
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    const decoded = decodeJwt(token);
    if (!decoded || isTokenExpired(decoded)) {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    setUser(decoded);
  }, [token]);

  const login = useCallback((newToken) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom hook ────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
