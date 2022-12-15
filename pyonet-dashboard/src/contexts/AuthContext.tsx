import { createContext, useState, useEffect } from "react";
import useHttp from "../hooks/useHttp";

type AuthContextType = {
  token: string;
  setToken: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: "",
  setToken: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: any) => {
  const http = useHttp();
  const [token, setTokenState] = useState("");

  // Check if the token is still valid
  useEffect(() => {
    if (token) {
      http
        .get("/auth/verify", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          if (!res) {
            logout();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const setToken = (token: string) => {
    setTokenState(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
