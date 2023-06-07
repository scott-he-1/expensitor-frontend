import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isUserAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserAuthenticated()) {
      navigate("/");
    }
  });

  return isUserAuthenticated() ? children : "";
};
