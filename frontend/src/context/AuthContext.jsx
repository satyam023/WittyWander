import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    console.log(decoded);
    setUser(decoded);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) logout();
        else {
          setUser(decoded);
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
