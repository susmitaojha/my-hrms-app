"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface DepartmentFormData {
  DepartmentName: string;
  status: number;
}

export default function AddDepartment() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<DepartmentFormData>({
    DepartmentName: "",
    status: 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.DepartmentName.trim()) {
      toast.error("Department Name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("/api/addDepartment", formData);

      if (res.data.success) {
        toast.success("Department created successfully.");
        router.push("/departments");
      } else {
        toast.error(res.data.message);
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
          href="/departments"
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="bg-blue-100 p-3 rounded-xl">
          <ShieldCheck className="w-7 h-7 text-blue-600" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Department
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new department for your organization.
          </p>
        </div>

      </div>

      {/* Form */}

      <div className="w-full bg-white rounded-2xl shadow border border-gray-200">

        <form onSubmit={handleSubmit}>

          <div className="p-8">

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Department Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Department Name */}

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Department Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="DepartmentName"
                  placeholder="Enter department name"
                  value={formData.DepartmentName}
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
                  <option value={0}>Active</option>
                  <option value={1}>Inactive</option>
                </select>
              </div>

            </div>

          </div>

          {/* Footer */}

          <div className="border-t bg-gray-50 rounded-b-2xl px-8 py-5 flex justify-end gap-3">

            <Link
              href="/department"
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Create Department"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}