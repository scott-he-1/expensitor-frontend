import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createStandaloneToast } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AuthProvider from "./context/AuthContext.tsx";
import { Login } from "./login/Login.tsx";
import { SignUp } from "./signup/Signup.tsx";
import { ProtectedRoute } from "./shared/ProtectedRoute.tsx";
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
  {path:"/dashboard/expenses", element: <Expense/>}
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
