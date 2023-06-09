import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AuthProvider from "./components/context/AuthContext.tsx";
import { Login } from "./components/login/Login.tsx";
import { SignUp } from "./components/signup/Signup.tsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.tsx";
import { Home } from "./Home.tsx";
import { Expense } from "./Expense.tsx";

const { ToastContainer } = createStandaloneToast();

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/expenses",
    element: (
      <ProtectedRoute>
        <Expense />
      </ProtectedRoute>
    ),
  },
]);

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
