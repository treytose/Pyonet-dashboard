import { createContext, useState, useEffect } from "react";

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
  const [token, setTokenState] = useState("");

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
