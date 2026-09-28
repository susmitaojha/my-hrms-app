"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Department {
    id: number;
    DepartmentName: string;
}

export default function DepartmentList() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetch("/api/getDepartments")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setDepartments(data.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const deleteDepartment = async (id: number) => {
        if (!confirm("Delete this department?")) return;

        try {
            const res = await fetch("/api/deleteDepartment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (data.success) {
                setDepartments((prev) =>
                    prev.filter((item) => item.id !== id)
                );
                toast.success("Department deleted successfully.");
            } else {
                toast.error(data.message || "Failed to delete department.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while deleting the department.");
        }
    };

    const filteredItems = useMemo(() => {
        return departments.filter((item) =>
            item.DepartmentName.toLowerCase().includes(
                filterText.toLowerCase()
            )
        );
    }, [departments, filterText]);

    const columns: TableColumn<Department>[] = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "100px",
        },
        {
            name: "Department Name",
            selector: (row) => row.DepartmentName,
            sortable: true,
            grow: 3,
        },
        {
            name: "Actions",
            width: "220px",
            cell: (row) => (
                <div className="flex gap-2">

                    <Link
                        href={`/departments/view/${row.id}`}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded text-white"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        href={`/departments/edit/${row.id}`}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        onClick={() => deleteDepartment(row.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
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
    };

    return (
        <div className="p-6">

            <div className="bg-white rounded-xl shadow-lg">

                <div className="flex justify-between items-center p-6 border-b">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Department List
                        </h1>

                        <p className="text-gray-500">
                            Total Departments: {filteredItems.length}
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/departments/add">
                                Add Department
                            </Link>
                        </Button>

                        <CSVLink
                            data={filteredItems}
                            filename="departments.csv"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md"
                        >
                            Export CSV
                        </CSVLink>

                    </div>

                </div>

                <div className="p-6">

                    <input
                        type="text"
                        placeholder="Search Department..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full md:w-96 border rounded-lg px-4 py-2"
                    />

                </div>

                <div className="px-6 pb-6">

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
                                Loading Departments...
                            </div>
                        }
                        noDataComponent={
                            <div className="py-10">
                                No Departments Found
                            </div>
                        }
                    />

                </div>

            </div>

        </div>
    );
}