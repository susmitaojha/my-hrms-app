"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Attendance {
    id: number;
    employee_id: number;

    emp_code: string;
    fname: string;
    mname: string | null;
    lname: string | null;
    //email: string;

    date: string;
    entry_time: string | null;
    exit_time: string | null;
    status: string;

    created_at: string;
    updated_at: string;
}

export default function AttendanceList() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    /* =========================
       Fetch Attendance
    ========================= */
    useEffect(() => {
        fetch("/api/getAttendances")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setAttendances(data.data);
                } else {
                    toast.error(
                        data.message ||
                            "Failed to fetch attendance records."
                    );
                }
            })
            .catch((error) => {
                console.error("Attendance fetch error:", error);
                toast.error("Failed to fetch attendance records.");
            })
            .finally(() => setLoading(false));
    }, []);

    /* =========================
       Employee Name
    ========================= */
    const getEmployeeName = (row: Attendance) => {
        return [row.fname, row.mname, row.lname]
            .filter(Boolean)
            .join(" ");
    };

    /* =========================
       Format Date
    ========================= */
    const formatDate = (date: string) => {
        if (!date) return "-";

        const formattedDate = new Date(date);

        if (isNaN(formattedDate.getTime())) {
            return date;
        }

        return formattedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    /* =========================
       Search / Filter
    ========================= */
    const filteredItems = useMemo(() => {
        const search = filterText.toLowerCase().trim();

        if (!search) {
            return attendances;
        }

        return attendances.filter((item) => {
            const employeeName = getEmployeeName(item);

            return (
                item.emp_code?.toLowerCase().includes(search) ||
                employeeName.toLowerCase().includes(search) ||
                // item.email?.toLowerCase().includes(search) ||
                item.status?.toLowerCase().includes(search) ||
                item.date?.toLowerCase().includes(search) ||
                item.entry_time?.toLowerCase().includes(search) ||
                item.exit_time?.toLowerCase().includes(search)
            );
        });
    }, [attendances, filterText]);

    /* =========================
       Table Columns
    ========================= */
    const columns: TableColumn<Attendance>[] = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "70px",
        },

        {
            name: "Employee Code",
            selector: (row) => row.emp_code || "-",
            sortable: true,
            width: "145px",
        },

        {
            name: "Employee Name",
            selector: (row) => getEmployeeName(row),
            sortable: true,
            grow: 2,
            minWidth: "150px",
        },

        // {
        //     name: "Email",
        //     selector: (row) => row.email || "-",
        //     sortable: true,
        //     grow: 2,
        //     minWidth: "180px",
        // },

        {
            name: "Date",
            selector: (row) => formatDate(row.date),
            sortable: true,
            width: "115px",
        },

        {
            name: "Entry Time",
            selector: (row) => row.entry_time || "-",
            sortable: true,
            width: "115px",
        },

        {
            name: "Exit Time",
            selector: (row) => row.exit_time || "-",
            sortable: true,
            width: "115px",
        },

        {
            name: "Status",
            sortable: true,
            width: "125px",

            cell: (row) => {
                const status = row.status?.toLowerCase();

                let className =
                    "px-3 py-1 rounded-full text-xs font-semibold";

                if (status === "present") {
                    className += " bg-green-100 text-green-700";
                } else if (status === "absent") {
                    className += " bg-red-100 text-red-700";
                } else if (status === "late") {
                    className += " bg-yellow-100 text-yellow-700";
                } else if (status === "half day") {
                    className += " bg-orange-100 text-orange-700";
                } else if (status === "leave") {
                    className += " bg-blue-100 text-blue-700";
                } else {
                    className += " bg-gray-100 text-gray-700";
                }

                return (
                    <span className={className}>
                        {row.status || "-"}
                    </span>
                );
            },
        },

        {
            name: "Actions",
            width: "100px",

            cell: (row) => (
                <div className="flex gap-2">
                    <Link
                        href={`/attendances/view/${row.id}`}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded text-white"
                        title="View Attendance"
                    >
                        <Eye size={18} />
                    </Link>
                </div>
            ),
        },
    ];

    /* =========================
       DataTable Styles
    ========================= */
    const customStyles = {
        table: {
            style: {
                borderRadius: "10px",
            },
        },

        headRow: {
            style: {
                backgroundColor: "#f8fafc",
                minHeight: "60px",
                fontWeight: "600",
                fontSize: "14px",
            },
        },

        rows: {
            style: {
                minHeight: "60px",
                fontSize: "14px",
            },

            highlightOnHoverStyle: {
                backgroundColor: "#eff6ff",
                cursor: "pointer",
            },
        },
    };

    /* =========================
       CSV Data
    ========================= */
    const csvData = filteredItems.map((item) => ({
        ID: item.id,
        "Employee Code": item.emp_code || "-",
        "Employee Name": getEmployeeName(item),
        // "Email": item.email || "-",
        Date: formatDate(item.date),
        "Entry Time": item.entry_time || "-",
        "Exit Time": item.exit_time || "-",
        Status: item.status || "-",
    }));

    /* =========================
       UI
    ========================= */
    return (
        <div className="p-6 w-full max-w-full overflow-x-hidden">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-full overflow-hidden">

                {/* =========================
                    Header
                ========================= */}
                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Attendance List
                        </h1>

                        <p className="text-gray-500">
                            Total Attendance: {filteredItems.length}
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <CSVLink
                            data={csvData}
                            filename="attendances.csv"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                            Export CSV
                        </CSVLink>

                    </div>
                </div>

                {/* =========================
                    Search
                ========================= */}
                <div className="p-6">

                    <input
                        type="text"
                        placeholder="Search Employee, Code, Email, Status..."
                        value={filterText}
                        onChange={(e) =>
                            setFilterText(e.target.value)
                        }
                        className="w-full md:w-96 border rounded-lg px-4 py-2"
                    />

                </div>

                {/* =========================
                    DataTable
                ========================= */}
                <div className="px-6 pb-6 w-full max-w-full overflow-hidden">

                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination
                        striped
                        responsive
                        highlightOnHover
                        pointerOnHover
                        fixedHeader
                        fixedHeaderScrollHeight="500px"

                        progressPending={loading}

                        progressComponent={
                            <div className="py-10">
                                Loading Attendances...
                            </div>
                        }

                        noDataComponent={
                            <div className="py-10">
                                No Attendance Records Found
                            </div>
                        }
                    />

                </div>

            </div>
        </div>
    );
}