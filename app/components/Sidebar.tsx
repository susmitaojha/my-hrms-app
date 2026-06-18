"use client";

import { Home, User, Briefcase, Users, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type SidebarProps = {
  sidebarOpen: boolean;
};

export default function Sidebar({
  sidebarOpen,
}: SidebarProps) {

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    document.cookie =
      "token=; path=/; Max-Age=0; SameSite=Lax";

    router.push("/login");
  };

  return (
    <div
      className={`bg-blue-600 text-white ${
        sidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 flex flex-col`}
    >

      {/* Logo */}
      <div className="p-4 font-bold text-lg border-b border-blue-500">
        {sidebarOpen ? "HRMS" : "Employee"}
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 space-y-3">

        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <Home />
          {sidebarOpen && "Dashboard"}
        </button>

        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <User />
          {sidebarOpen && "Profile"}
        </button>
        <button
          onClick={() => router.push("/employees")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <Briefcase />
          {sidebarOpen && "Employees"}
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <Settings />
          {sidebarOpen && "Settings"}
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 p-2 rounded"
        >
          <LogOut />
          {sidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );
}