"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Calendar,
  User,
  Home,
  Settings,
  Menu,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!token) router.push("/login");
    if (storedUsername) setUsername(storedUsername);

    generateCalendar(new Date());
  }, []);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    setCalendarDays(days);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(newDate);
    generateCalendar(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(newDate);
    generateCalendar(newDate);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    document.cookie = "token=; path=/; Max-Age=0; SameSite=Lax";
    router.push("/login");
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔥 Sidebar */}
      <div
        className={`bg-blue-600 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 font-bold text-lg border-b border-blue-500">
          {sidebarOpen ? "My App" : "MA"}
        </div>

        <div className="flex-1 p-4 space-y-3">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded">
            <Home /> {sidebarOpen && "Dashboard"}
          </button>

          <button onClick={() => router.push("/profile")} className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded">
            <User /> {sidebarOpen && "Profile"}
          </button>

          <button onClick={() => router.push("/settings")} className="flex items-center gap-3 w-full p-2 hover:bg-blue-500 rounded">
            <Settings /> {sidebarOpen && "Settings"}
          </button>
        </div>

        <div className="p-4 border-t border-blue-500">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full bg-red-500 hover:bg-red-600 p-2 rounded">
            <LogOut /> {sidebarOpen && "Logout"}
          </button>
        </div>
      </div>

      {/* 🔥 Main Area */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 Top Navbar */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <User />
            <span className="font-medium">{username || "User"}</span>
          </div>
        </div>

        {/* 🔥 Content */}
        <div className="p-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Calendar */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-lg">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <div>
                  <button onClick={handlePrevMonth}>←</button>
                  <button onClick={handleNextMonth}>→</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center font-bold">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day, i) => {
                  const isToday = isCurrentMonth && day === today.getDate();

                  return (
                    <div
                      key={i}
                      className={`h-10 flex items-center justify-center rounded ${
                        isToday ? "bg-blue-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Cards */}
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">Profile</h3>
                <p>{username}</p>
              </div>

              <div className="bg-blue-500 text-white p-4 rounded shadow">
                <h3 className="font-bold">Stats</h3>
                <p>Active</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}