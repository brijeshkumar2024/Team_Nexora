import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext(null);

const TOKEN_KEY = "nexora_token";
const USER_KEY = "nexora_user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      authService
        .me()
        .then((res) => {
          setUser(res.data);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setAuthToken(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (payload) => {
    const res = await authService.login(payload);
    const nextToken = res.data.token;
    const nextUser = res.data.user;
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
