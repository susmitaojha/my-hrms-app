"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import DataTable, { TableColumn } from "react-data-table-component";
import { CSVLink } from "react-csv";
import { Eye, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Role {
    id: number;
    role_name: string;
    status: number;
    created_at: string;
}

export default function RoleList() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        fetch("/api/getRoles")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setRoles(data.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const deleteRole = async (id: number) => {
        if (!confirm("Delete this role?")) return;

        try {
            const res = await fetch("/api/deleteRole", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();

            if (data.success) {
                setRoles((prev) =>
                    prev.filter((role) => role.id !== id)
                );
                toast.success("Role deleted successfully.");
            } else {
                toast.error(data.message || "Failed to delete role.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredItems = useMemo(() => {
        const search = filterText.toLowerCase();

        return roles.filter((item) =>
            [item.role_name]
                .map((value) => String(value ?? "").toLowerCase())
                .some((value) => value.includes(search))
        );
    }, [roles, filterText]);

    const columns: TableColumn<Role>[] = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "100px",
        },
        {
            name: "Role Name",
            selector: (row) => row.role_name,
            sortable: true,
            grow: 2,
        },
        {
            name: "Created At",
            selector: (row) =>
                new Date(row.created_at).toLocaleDateString(),
            sortable: true,
            width: "180px",
        },
        {
            name: "Status",
            sortable: true,
            width: "150px",
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {row.status === 0 ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            name: "Actions",
            width: "220px",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/role/view/${row.id}`}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white"
                    >
                        <Eye size={18} />
                    </Link>

                    <Link
                        href={`/role/edit/${row.id}`}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white"
                    >
                        <Pencil size={18} />
                    </Link>

                    <button
                        onClick={() => deleteRole(row.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
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

                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Role List
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Total Roles: {filteredItems.length}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            asChild
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Link href="/role/add">
                                Add Role
                            </Link>
                        </Button>

                        <CSVLink
                            data={filteredItems}
                            filename="roles.csv"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md"
                        >
                            Export CSV
                        </CSVLink>
                    </div>
                </div>

                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Search Role..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="px-6 pb-6">
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        customStyles={customStyles}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
                                Loading Roles...
                            </div>
                        }
                        noDataComponent={
                            <div className="py-10 text-gray-500">
                                No Roles Found
                            </div>
                        }
                    />
                </div>

            </div>
        </div>
    );
}