import React, { createContext, useContext, useEffect, useState } from "react";
import { login as performLogin } from "../services/client.js";
import { AuthContextType, User } from "../types.js";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => Promise.resolve().then(),
  logOut: () => {},
  isUserAuthenticated: () => false,
  setUserFromToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const setUserFromToken = () => {
    let token = localStorage.getItem("user_token");
    if (token) {
      setUser(token);
    }
  };
  useEffect(() => {
    setUserFromToken();
  }, []);

  const login = async (emailAndPassword: {
    email: string;
    password: string;
  }) => {
    return new Promise((resolve, reject) => {
      performLogin(emailAndPassword)
        .then((res) => {
          const jwtToken = res.headers["authorization"];
          localStorage.setItem("user_token", jwtToken);

          setUser(jwtToken);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const logOut = () => {
    localStorage.removeItem("user_token");
    setUser(null);
  };

  const isUserAuthenticated = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logOut,
        isUserAuthenticated,
        setUserFromToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return {
    user: context.user,
    login: context.login,
    logOut: context.logOut,
    isUserAuthenticated: context.isUserAuthenticated,
    setUserFromToken: context.setUserFromToken,
  };
};

export default AuthProvider;
