import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/common/ScrollToTop";

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
        <ToastContainer limit={3} />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1C1C1A",
              color: "#FBFBFA",
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              border: "0.5px solid #E5E0D5",
              borderRadius: "8px",
              padding: "12px 24px",
            },
            success: {
              iconTheme: {
                primary: "#B94A24",
                secondary: "#FBFBFA",
              },
            },
          }}
        />
      </Router>
    </HelmetProvider>
  );
}