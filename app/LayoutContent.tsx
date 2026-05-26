"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Username from localStorage - use useEffect to avoid hydration mismatch
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

  // Routes that don't need the full layout (login, register, etc.)
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // If still loading, don't render anything yet to avoid hydration issues
  if (isLoading) {
    return null;
  }

  // If on auth pages (login/register), just show children without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For all other pages, show full layout with sidebar, header, footer
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          username={username}
        />

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
