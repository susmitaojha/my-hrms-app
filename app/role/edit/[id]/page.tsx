"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface RoleFormData {
  role_name: string;
  status: number;
}

export default function EditRole() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<RoleFormData>({
    role_name: "",
    status: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "status" ? Number(value) : value,
    });
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/getRoles?status=all");
        const role = res.data?.data?.find((item: any) => String(item.id) === String(params.id));

        if (role) {
          setFormData({
            role_name: role.role_name || "",
            status: Number(role.status ?? 1),
          });
        } else {
          toast.error("Role not found.");
          router.push("/role");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load role.");
        router.push("/role");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRole();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role_name.trim()) {
      toast.error("Role Name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("/api/updateRole", {
        id: params.id,
        ...formData,
      });

      if (res.data.success) {
        toast.success("Role updated successfully.");
        router.push("/role");
      } else {
        toast.error(res.data.message || "Failed to update role.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">

      {/* Page Header */}

      <div className="flex items-center gap-4 mb-8">

        <Link
          href="/role"
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="bg-blue-100 p-3 rounded-xl">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Role
          </h1>

          <p className="text-gray-500 mt-1">
            Update the details of the selected role.
          </p>
        </div>

      </div>

      {/* Form */}

      <div className="w-full bg-white rounded-2xl shadow border border-gray-200">

        <form onSubmit={handleSubmit}>

          <div className="p-8">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Role Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Role Name */}

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Role Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="role_name"
                  placeholder="Enter role name"
                  value={formData.role_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Status */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="border-t bg-gray-50 rounded-b-2xl px-8 py-5 flex justify-end gap-3">

            <Link
              href="/role"
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || loading}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : loading ? "Loading..." : "Update Role"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}