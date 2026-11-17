/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Attendance {
    id?: number;
    entry_time?: string | null;
    exit_time?: string | null;
    status?: string | null;
}

export default function Dashboard() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<(number | null)[]>([]);

    const [attendance, setAttendance] = useState<Attendance | null>(null);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [punchLoading, setPunchLoading] = useState(false);

    // ----------------------------------------------------
    // Month Names
    // ----------------------------------------------------
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

    // ----------------------------------------------------
    // Day Names
    // ----------------------------------------------------
    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    // ----------------------------------------------------
    // Generate Calendar
    // ----------------------------------------------------
    const generateCalendar = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();

        // 0 = Sunday
        const startingDayOfWeek = firstDay.getDay();

        const days: (number | null)[] = [];

        // Empty spaces before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Actual dates
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        setCalendarDays(days);
    };

    const getTodayAttendance = async () => {
        try {
            setLoadingAttendance(true);

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                "/api/getAttendanceStatus",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to get attendance"
                );
            }

            if (data.success) {
                setAttendance(data.attendance || null);
            } else {
                setAttendance(null);
            }
        } catch (error) {
            console.error("Attendance error:", error);
            setAttendance(null);
        } finally {
            setLoadingAttendance(false);
        }
    };

    const handleInvalidSession = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        document.cookie = "token=; path=/; Max-Age=0; SameSite=Lax";
        router.replace("/login");
    };

    // ----------------------------------------------------
    // Punch In
    // ----------------------------------------------------
    const handlePunchIn = async () => {
        try {
            setPunchLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                "/api/punchIn",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                alert(data.message || "Please sign in again.");
                handleInvalidSession();
                return;
            }

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                        "Unable to punch in."
                );
                return;
            }

            alert("Punch In successful.");

            // Refresh attendance
            await getTodayAttendance();
        } catch (error) {
            console.error("Punch In error:", error);
            alert("Something went wrong while punching in.");
        } finally {
            setPunchLoading(false);
        }
    };

    // ----------------------------------------------------
    // Punch Out
    // ----------------------------------------------------
    const handlePunchOut = async () => {
        try {
            setPunchLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await fetch(
                "/api/punchOut",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (response.status === 401) {
                alert(data.message || "Please sign in again.");
                handleInvalidSession();
                return;
            }

            if (!response.ok || !data.success) {
                alert(
                    data.message ||
                        "Unable to punch out."
                );
                return;
            }

            alert("Punch Out successful.");

            // Refresh attendance
            await getTodayAttendance();
        } catch (error) {
            console.error("Punch Out error:", error);
            alert("Something went wrong while punching out.");
        } finally {
            setPunchLoading(false);
        }
    };

    // ----------------------------------------------------
    // Previous Month
    // ----------------------------------------------------
    const handlePrevMonth = () => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
        );

        setCurrentDate(newDate);
        generateCalendar(newDate);
    };

    // ----------------------------------------------------
    // Next Month
    // ----------------------------------------------------
    const handleNextMonth = () => {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
        );

        setCurrentDate(newDate);
        generateCalendar(newDate);
    };

    // ----------------------------------------------------
    // Check Authentication + Initial Data
    // ----------------------------------------------------
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername =
            localStorage.getItem("username");

        if (!token) {
            router.push("/login");
            return;
        }

        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Generate current month calendar
        generateCalendar(new Date());

        // Get today's attendance
        getTodayAttendance();
    }, [router]);

    // ----------------------------------------------------
    // Today's Date
    // ----------------------------------------------------
    const today = new Date();

    const isCurrentMonth =
        today.getFullYear() ===
            currentDate.getFullYear() &&
        today.getMonth() ===
            currentDate.getMonth();

    // ----------------------------------------------------
    // Punch Status
    // ----------------------------------------------------
    const isPunchedIn =
        !!attendance?.entry_time &&
        !attendance?.exit_time;

    const isPunchedOut =
        !!attendance?.entry_time &&
        !!attendance?.exit_time;

    // ----------------------------------------------------
    // JSX
    // ----------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* ----------------------------------------- */}
            {/* Welcome */}
            {/* ----------------------------------------- */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Welcome {username || "User"}
                </h1>

                <p className="text-gray-500">
                    Manage your attendance
                </p>
            </div>

            {/* ----------------------------------------- */}
            {/* Main Grid */}
            {/* ----------------------------------------- */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ===================================== */}
                {/* Calendar */}
                {/* ===================================== */}

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

                    {/* Calendar Header */}

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="font-bold text-xl text-gray-800">
                            {monthNames[
                                currentDate.getMonth()
                            ]}{" "}
                            {currentDate.getFullYear()}
                        </h2>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                ←
                            </button>

                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                →
                            </button>

                        </div>
                    </div>

                    {/* Day Names */}

                    <div className="grid grid-cols-7 gap-2 mb-2">

                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center font-bold text-gray-600 py-2"
                            >
                                {day}
                            </div>
                        ))}

                    </div>

                    {/* Calendar Dates */}

                    <div className="grid grid-cols-7 gap-2">

                        {calendarDays.map(
                            (day, index) => {

                                const isToday =
                                    isCurrentMonth &&
                                    day === today.getDate();

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            h-12
                                            flex
                                            items-center
                                            justify-center
                                            rounded-lg
                                            text-sm
                                            font-medium
                                            ${
                                                day === null
                                                    ? "bg-transparent"
                                                    : isToday
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }
                                        `}
                                    >
                                        {day}
                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

                {/* ===================================== */}
                {/* Right Side */}
                {/* ===================================== */}

                <div className="space-y-6">

                    {/* --------------------------------- */}
                    {/* Attendance Card */}
                    {/* --------------------------------- */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h3 className="font-bold text-xl mb-5 text-gray-800">
                            Attendance
                        </h3>

                        {/* Status */}

                        <div className="mb-5">

                            <p className="text-gray-600 mb-1">
                                Status
                            </p>

                            {loadingAttendance ? (
                                <span className="text-gray-400 font-semibold">
                                    Loading...
                                </span>
                            ) : (
                                <span
                                    className={`
                                        font-semibold
                                        ${
                                            isPunchedIn
                                                ? "text-green-600"
                                                : isPunchedOut
                                                ? "text-blue-600"
                                                : "text-gray-500"
                                        }
                                    `}
                                >
                                    {isPunchedIn
                                        ? "Punched In"
                                        : isPunchedOut
                                        ? "Completed"
                                        : "Not Punched In"}
                                </span>
                            )}

                        </div>

                        {/* Entry Time */}

                        {attendance?.entry_time && (
                            <div className="mb-3">

                                <p className="text-sm text-gray-500">
                                    Entry Time
                                </p>

                                <p className="font-semibold text-gray-800">
                                    {attendance.entry_time}
                                </p>

                            </div>
                        )}

                        {/* Exit Time */}

                        {attendance?.exit_time && (
                            <div className="mb-5">

                                <p className="text-sm text-gray-500">
                                    Exit Time
                                </p>

                                <p className="font-semibold text-gray-800">
                                    {attendance.exit_time}
                                </p>

                            </div>
                        )}

                        {/* Buttons */}

                        {loadingAttendance ? (
                            <button
                                disabled
                                className="w-full px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                            >
                                Loading...
                            </button>
                        ) : punchLoading ? (
                            <button
                                disabled
                                className="w-full px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                            >
                                Processing...
                            </button>
                        ) : isPunchedIn ? (
                            <button
                                type="button"
                                onClick={
                                    handlePunchOut
                                }
                                className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                                Punch Out
                            </button>
                        ) : isPunchedOut ? (
                            <button
                                type="button"
                                disabled
                                className="w-full px-4 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed"
                            >
                                Attendance Completed
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={
                                    handlePunchIn
                                }
                                className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                            >
                                Punch In
                            </button>
                        )}

                    </div>

                    <div className="bg-blue-500 text-white p-6 rounded-xl shadow">

                        <h3 className="font-bold text-lg mb-2">
                            Status
                        </h3>

                        <p className="text-blue-100">
                            {isPunchedIn
                                ? "You are currently working."
                                : isPunchedOut
                                ? "Today's attendance is completed."
                                : "You have not punched in today."}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}