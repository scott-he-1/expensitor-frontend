import React, { createContext, useContext, useEffect, useState } from "react";
import { login as performLogin } from "../services/client.js";
import { AuthContextType } from "../types.js";
import jwtDecode from "jwt-decode";

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: null,
  login: () => Promise.resolve().then(),
  logOut: () => {},
  isUserAuthenticated: () => false,
  setUserFromToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const setUserFromToken = () => {
    let token = localStorage.getItem("user_token");
    if (token) {
      const user: { email: string; id: number; iat: number } = jwtDecode(token);
      setUser(user.email);
      setUserId(user.id);
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
          localStorage.setItem("user_token", res.data["user_token"]);
          setUserFromToken();
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
        userId,
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
    userId: context.userId,
    login: context.login,
    logOut: context.logOut,
    isUserAuthenticated: context.isUserAuthenticated,
    setUserFromToken: context.setUserFromToken,
  };
};

export default AuthProvider;
