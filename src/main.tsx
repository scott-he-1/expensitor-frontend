import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import AuthProvider, { useAuth } from "./context/AuthContext.tsx";
import { Login } from "./login/Login.tsx";

const { ToastContainer } = createStandaloneToast();

const router = createBrowserRouter([{ path: "/", element: <Login /> }]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ToastContainer />
    </ChakraProvider>
  </React.StrictMode>
);
