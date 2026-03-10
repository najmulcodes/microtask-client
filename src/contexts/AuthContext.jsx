import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) { setLoading(false); return; }

    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => localStorage.removeItem("access-token"))
      .finally(() => setLoading(false));
  }, []);

  const saveToken = (token) => localStorage.setItem("access-token", token);

  // Register (supports FormData for photo upload)
  const register = async (formData) => {
    const res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Google login — credential comes from @react-oauth/google
  const googleLogin = async (credential) => {
    const res = await api.post("/auth/google", { credential });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access-token");
    setUser(null);
  };

  // Refresh user from server
  const refreshUser = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
  };

  const value = { user, loading, register, login, googleLogin, logout, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
