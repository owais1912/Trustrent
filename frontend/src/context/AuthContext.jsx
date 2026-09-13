import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("trustrent_user");
    const token = localStorage.getItem("trustrent_token");

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("trustrent_user");
        localStorage.removeItem("trustrent_token");
      }
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const userData = response.data;

    localStorage.setItem("trustrent_token", userData.accessToken);
    localStorage.setItem("trustrent_user", JSON.stringify(userData));

    setUser(userData);

    return userData;
  }

  async function register(data) {
    const response = await api.post("/auth/register", data);

    const userData = response.data;

    localStorage.setItem("trustrent_token", userData.accessToken);
    localStorage.setItem("trustrent_user", JSON.stringify(userData));

    setUser(userData);

    return userData;
  }

  function logout() {
    localStorage.removeItem("trustrent_token");
    localStorage.removeItem("trustrent_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}