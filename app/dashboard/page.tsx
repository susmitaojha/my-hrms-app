"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    // Redirect if not logged in
    if (!token) {
      router.push("/login");
      return;
    }

    // Set username
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Generate calendar
    generateCalendar(new Date());
  }, [router]);

  // Generate calendar days
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Empty spaces before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    setCalendarDays(days);
  };

  // Previous month
  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );

    setCurrentDate(newDate);
    generateCalendar(newDate);
  };

  // Next month
  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );

    setCurrentDate(newDate);
    generateCalendar(newDate);
  };

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Today's date
  const today = new Date();

  const isCurrentMonth =
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth();

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">

            <h2 className="font-bold text-lg">
              {monthNames[currentDate.getMonth()]}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-3">

              <button
                onClick={handlePrevMonth}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ←
              </button>

              <button
                onClick={handleNextMonth}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                →
              </button>

            </div>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">

            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center font-bold"
              >
                {day}
              </div>
            ))}

            {/* Dates */}
            {calendarDays.map((day, i) => {

              const isToday =
                isCurrentMonth &&
                day === today.getDate();

              return (
                <div
                  key={i}
                  className={`h-10 flex items-center justify-center rounded
                    ${
                      day === null
                        ? "bg-transparent"
                        : isToday
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="space-y-4">

          {/* Stats */}
          <div className="bg-blue-500 text-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">
              Status
            </h3>

            <p>Active</p>
          </div>

        </div>

      </div>
    </div>
  );
}