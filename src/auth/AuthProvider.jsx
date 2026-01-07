import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * =====================================================
   * 🔁 AUTO RESTORE USER DARI TOKEN (PENTING)
   * =====================================================
   * - Supaya refresh tidak logout
   * - Supaya websocket aktif
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me") // ⬅️ endpoint backend auth user
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * =====================
   * LOGIN
   * =====================
   */
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  /**
   * =====================
   * LOGOUT
   * =====================
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* ⛔ JANGAN render APP sebelum user direstore */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * =====================
 * HOOK
 * =====================
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
