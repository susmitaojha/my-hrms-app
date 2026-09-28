'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldCheck, Eye } from "lucide-react";

interface RoleDetail {
  id: number;
  role_name: string;
  status: number;
  created_at: string;
  updated_at?: string;
}

export default function ViewRole() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/getRoles?status=all");
        const found = res.data?.data?.find(
          (item: RoleDetail) => String(item.id) === String(params.id)
        );

        if (found) {
          setRole(found);
        } else {
          toast.error("Role not found.");
          router.push("/role");
        }
      } catch (error: unknown) {
        console.error(error);
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to load role."
          : "Failed to load role.";
        toast.error(message);
        router.push("/role");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRole();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-8 shadow">Loading role...</div>
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/role"
          className="rounded-lg p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="rounded-xl bg-green-100 p-3">
          <Eye className="h-7 w-7 text-green-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Role Details</h1>
          <p className="mt-1 text-gray-500">View the selected role information.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow">
        <div className="border-b px-8 py-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">{role.role_name}</h2>
          </div>
        </div>

        <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">Role Name</p>
            <p className="mt-1 text-lg font-semibold text-gray-800">{role.role_name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="mt-1 text-lg font-semibold text-gray-800">
              {role.status === 0 ? "Active" : "Inactive"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="mt-1 text-lg font-semibold text-gray-800">
              {new Date(role.created_at).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="mt-1 text-lg font-semibold text-gray-800">
              {role.updated_at ? new Date(role.updated_at).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
