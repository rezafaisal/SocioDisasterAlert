import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorProvider } from "./ErrorProvider";
import { StyleProvider } from "./StyleProvider";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { HelmetProvider } from "react-helmet-async";

type props = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();

export const AppProvider: React.FC<props> = ({ children }) => {
  return (
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <StyleProvider>
            <AuthProvider>
              <HelmetProvider>{children}</HelmetProvider>
            </AuthProvider>
          </StyleProvider>
        </Router>
      </QueryClientProvider>
    </ErrorProvider>
  );
};
