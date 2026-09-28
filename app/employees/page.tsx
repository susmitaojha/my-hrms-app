"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button"
import DataTable, {
    TableColumn,
} from "react-data-table-component";
import { CSVLink } from "react-csv";
import {
    Eye,
    Pencil,
    Trash2
} from "lucide-react";

interface Employee {
    id: number;
    emp_code: string;
    fname: string;
    lname: string;
    email: string;
    contact_no: string;
    department: string;
    role: string;
    status: number;
}

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetch("/api/getEmployees")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setEmployees(data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const deleteEmployee = async (id: number) => {
        if (!confirm("Delete this employee?")) return;

        try {
            const res = await fetch("/api/deleteEmployee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (data.success) {
                setEmployees((prev) =>
                    prev.filter((emp) => emp.id !== id)
                );
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredItems = useMemo(() => {
        const search = filterText.toLowerCase();

        return employees.filter((item) =>
            [
                item.emp_code,
                item.fname,
                item.lname,
                item.email,
                item.contact_no,
                item.department,
                item.role,
            ]
                .map((value) =>
                    String(value ?? "")
                        .toLowerCase()
                )
                .some((value) =>
                    value.includes(search)
                )
        );
    }, [employees, filterText]);

    const columns: TableColumn<Employee>[] = [
        {
            name: "Code",
            selector: (row) => row.emp_code,
            sortable: true,
            width: "120px",
        },
        {
            name: "Name",
            selector: (row) =>
                `${row.fname} ${row.lname}`,
            sortable: true,
            grow: 2,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
            grow: 2,
        },
        {
            name: "Phone",
            selector: (row) => row.contact_no,
        },
        {
            name: "Department",
            selector: (row) => row.department,
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) =>
                String(row.role ?? ""),
            sortable: true,
        },
        {
            name: "Status",
            sortable: true,
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${row.status === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.status === 0
                        ? "Active"
                        : "Inactive"}
                </span>
            ),
        },
        {
            name: "Actions",
            width: "250px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/employee/view/${row.id}`}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                        title="View"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        href={`/employee/edit/${row.id}`}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        onClick={() => deleteEmployee(row.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

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
        pagination: {
            style: {
                borderTop: "1px solid #e5e7eb",
            },
        },
    };

    return (
        <div className="p-6">
            <div className="bg-white rounded-xl shadow-lg">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    {/* Left Side */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Employee List
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Total Employees: {filteredItems.length}
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex gap-2">
                        <Button
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Link href="/employee/add">
                                Add Employee
                            </Link>
                        </Button>

                        <CSVLink
                            data={filteredItems}
                            filename="employees.csv"
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md">
                            Export CSV
                        </CSVLink>
                    </div>
                </div>

                {/* Search */}
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={filterText}
                        onChange={(e) =>
                            setFilterText(
                                e.target.value
                            )
                        }
                        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* DataTable */}
                <div className="px-6 pb-6">
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[
                            10,
                            25,
                            50,
                            100,
                        ]}
                        responsive
                        striped
                        highlightOnHover
                        pointerOnHover
                        selectableRows
                        selectableRowsHighlight
                        fixedHeader
                        fixedHeaderScrollHeight="500px"
                        persistTableHead
                        progressPending={loading}
                        progressComponent={
                            <div className="py-10">
                                Loading Employees...
                            </div>
                        }
                        noDataComponent={
                            <div className="py-10 text-gray-500">
                                No Employees Found
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}