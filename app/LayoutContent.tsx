"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username") || "";

    setUsername(storedUsername);
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  // Loading Screen
  if (isLoading) {
    return (
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "14px 18px",
            fontSize: "15px",
            fontWeight: "500",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },

          success: {
            style: {
              background: "#16a34a",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#16a34a",
            },
          },

          error: {
            style: {
              background: "#dc2626",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#dc2626",
            },
          },

          loading: {
            style: {
              background: "#2563eb",
              color: "#ffffff",
            },
          },

          blank: {
            style: {
              background: "#374151",
              color: "#ffffff",
            },
          },
        }}
      />
    );
  }

  // Login/Register Page
  if (isAuthPage) {
    return (
      <>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              padding: "14px 18px",
              fontSize: "15px",
              fontWeight: "500",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            },

            success: {
              style: {
                background: "#16a34a",
                color: "#ffffff",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#16a34a",
              },
            },

            error: {
              style: {
                background: "#dc2626",
                color: "#ffffff",
              },
              iconTheme: {
                primary: "#ffffff",
                secondary: "#dc2626",
              },
            },

            loading: {
              style: {
                background: "#2563eb",
                color: "#ffffff",
              },
            },

            blank: {
              style: {
                background: "#374151",
                color: "#ffffff",
              },
            },
          }}
        />

        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            padding: "14px 18px",
            fontSize: "15px",
            fontWeight: "500",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },

          success: {
            style: {
              background: "#16a34a",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#16a34a",
            },
          },

          error: {
            style: {
              background: "#dc2626",
              color: "#ffffff",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#dc2626",
            },
          },

          loading: {
            style: {
              background: "#2563eb",
              color: "#ffffff",
            },
          },

          blank: {
            style: {
              background: "#374151",
              color: "#ffffff",
            },
          },
        }}
      />

      <Sidebar sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          username={username}
        />

        <main className="flex-1 p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
}