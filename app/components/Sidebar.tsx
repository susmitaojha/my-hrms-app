/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Home,
  User,
  Briefcase,
  Settings,
  LogOut,
  FolderTree,
  KeyRound,
  CalendarCheck,
  ChevronDown,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type SidebarProps = {
  sidebarOpen: boolean;
};

type CustomJwtPayload = {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export default function Sidebar({
  sidebarOpen,
}: SidebarProps) {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [leaveMenuOpen, setLeaveMenuOpen] = useState(false);

  const leaveOptions = [
    "Leave types",
    "Leave policies",
    "Leave allocations",
    "Leave applications",
    "Leave approvals",
    "Leave balances",
    "Leave transactions",
    "Holidays",
  ];

  // Get logged-in user's role
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);

        console.log("User from localStorage:", user);

        setRole(user.role ?? null);
      } catch (error) {
        console.error("Invalid user data:", error);
        setRole(null);
      }
    }
  }, []);

  // Dashboard navigation based on JWT role
  const handleDashboard = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);

      console.log("Decoded JWT:", decoded);
      console.log("JWT Role:", decoded.role);

      const userRole = decoded.role?.trim().toLowerCase();

      if (
        userRole === "admin" ||
        userRole === "super_admin"
      ) {
        router.push("/dashboard");
      } else {
        router.push("/employee_dashboard");
      }
    } catch (error) {
      console.error("Invalid JWT:", error);
      router.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    document.cookie =
      "token=; path=/; Max-Age=0; SameSite=Lax";

    router.push("/login");
  };

  return (
    <div
      className={`bg-blue-600 text-white ${sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 font-bold text-lg border-b border-blue-500">
        {sidebarOpen ? "HRMS" : "Employee"}
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 space-y-3">

        {/* Dashboard */}
        <button
          onClick={handleDashboard}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <Home />
          {sidebarOpen && "Dashboard"}
        </button>

        {/* Attendance */}
        <button
          onClick={() => router.push("/attendance")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <CalendarCheck />
          {sidebarOpen && "Attendance"}
        </button>

        {/* Leave */}
        <div>
          <button
            type="button"
            onClick={() => setLeaveMenuOpen((open) => !open)}
            aria-expanded={leaveMenuOpen}
            aria-controls="leave-management-options"
            className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
          >
            <CalendarCheck size={20} />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">Leave Management</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${leaveMenuOpen ? "rotate-180" : ""}`}
                />
              </>
            )}
          </button>
          {sidebarOpen && leaveMenuOpen && (
            <div
              id="leave-management-options"
              className="ml-9 mt-1 space-y-1"
            >
              {leaveOptions.map((option) => (
                <div
                  key={option}
                  className="rounded px-2 py-1.5 text-sm hover:bg-blue-500"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <User />
          {sidebarOpen && "Profile"}
        </button>

        {/* Employees */}
        <button
          onClick={() => router.push("/employees")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <Briefcase />
          {sidebarOpen && "Employees"}
        </button>

        {/* Role */}
        <button
          onClick={() => router.push("/role")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <KeyRound size={20} />
          {sidebarOpen && "Role"}
        </button>

        {/* Departments */}
        <button
          onClick={() => router.push("/departments")}
          className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded"
        >
          <FolderTree size={20} />
          {sidebarOpen && "Departments"}
        </button>

        {/* Settings */}
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
          className="flex items-center gap-3 w-full bg-gray-500 hover:bg-gray-600 p-2 rounded"
        >
          <LogOut />
          {sidebarOpen && "Logout"}
        </button>
      </div>
    </div>
  );
}