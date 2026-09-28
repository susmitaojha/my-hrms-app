"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Employee {
  id: number;
  emp_code: string;
  fname: string;
  mname: string;
  lname: string;
  employee_name: string;

  email: string;
  contact_no: string;
  dob: string;
  joining_date: string;
  emp_photo: string;
  gender: string;

  department_name: string;
  role_name: string;

  team_leader_name: string;
  team_leader_code: string;

  address_line1: string;
  address_line2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;

  fixedsalary: number;
  created_at: string;
  updated_at: string;

  cl: number;
  salary_deduction: number;
  status: number;
  emp_cv?: string | null;
}

type InfoItemProps = {
  label: string;
  value: string | number | null | undefined;
};

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="bg-gray-50 border rounded-xl p-4 hover:shadow-sm transition">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-semibold text-gray-800 break-words">
      {value || "-"}
    </p>
  </div>
);

export default function EmployeeViewPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/getSingleEmployee?id=${id}`
        );

        const data = await response.json();

        if (data.success) {
          setEmployee(data.data);
          setError("");
        } else {
          setError(data.message || "Employee not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-lg font-medium text-gray-600">
          Loading employee details...
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error || "Employee not found"}
        </div>

        <Link
          href="/employee"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Employee List
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white-500 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Header */}
            {/* <div className=" p-8 bg-amber-500">
            <span className="text-blue-300">
              Employee Details: {employee.fname} {employee.lname}
            </span>

          </div> */}
            <div className="bg-yellow-600 flex flex-col md:flex-row items-center gap-6">

              {/* Employee Photo */}
              <div>
                {employee.emp_photo ? (
                  <img
                    src={employee.emp_photo.startsWith('uploads/') ? `/${employee.emp_photo}` : `/uploads/employees/${employee.emp_photo}`}
                    alt={employee.fname}
                    className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold">
                    {employee.fname?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Employee Info */}
              <div>
                <h1 className="text-4xl font-bold text-green-100">
                  {employee.fname} {employee.lname}
                </h1>

                <p className="text-green-100 mt-2 text-lg">
                  Employee Code: {employee.emp_code}
                </p>
                <p className="text-indigo-100">
                  {employee.role_name} | {employee.department_name}
                </p>

                <span
                  className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold text-white ${employee.status === 0
                      ? "bg-green-500"
                      : "bg-red-500"
                    }`}
                >
                  {employee.status === 0
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-10">

              {/* Personal Information */}
              <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <InfoItem label="Email" value={employee.email} />
                  <InfoItem
                    label="Contact Number"
                    value={employee.contact_no}
                  />
                  <InfoItem
                    label="Gender"
                    value={employee.gender}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={new Date(employee.dob).toLocaleDateString("en-IN")}
                  />
                  <InfoItem
                    label="Joining Date"
                    value={new Date(employee.joining_date).toLocaleDateString("en-IN")}
                  />
                  <InfoItem
                    label="Department"
                    value={employee.department_name}
                  />
                  <InfoItem
                    label="Role"
                    value={employee.role_name}
                  />
                  <InfoItem
                    label="Created At"
                    value={new Date(
                      employee.created_at
                    ).toLocaleString()}
                  />
                  <InfoItem
                    label="Updated At"
                    value={new Date(
                      employee.updated_at
                    ).toLocaleString()}
                  />
                </div>
              </section>

              {/* Salary Information */}
              <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Salary Information
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <InfoItem
                    label="Fixed Salary"
                    value={`₹${employee.fixedsalary}`}
                  />
                  <InfoItem
                    label="Casual Leave (CL)"
                    value={employee.cl}
                  />
                  <InfoItem
                    label="Salary Deduction"
                    value={`₹${employee.salary_deduction}`}
                  />
                </div>
              </section>

              {/* Reporting Structure */}
              <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Reporting Structure
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  <InfoItem
                    label="Team Lead"
                    value={`${employee.team_leader_name} (${employee.team_leader_code})`}
                  />
                </div>
              </section>

              {/* Address Information */}
              <section>
                <h2 className="text-xl font-bold mb-4 border-b pb-2">
                  Address Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <InfoItem
                    label="Address Line 1"
                    value={employee.address_line1}
                  />
                  <InfoItem
                    label="Address Line 2"
                    value={employee.address_line2}
                  />
                  <InfoItem
                    label="City"
                    value={employee.city}
                  />
                  <InfoItem
                    label="District"
                    value={employee.district}
                  />
                  <InfoItem
                    label="State"
                    value={employee.state}
                  />
                  <InfoItem
                    label="Pincode"
                    value={employee.pincode}
                  />
                </div>
              </section>

              {/* Documents */}
              {employee.emp_cv && (
                <section>
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">
                    Documents
                  </h2>

                  <a
                    href={employee.emp_cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                  >
                    View Employee CV
                  </a>
                </section>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4 border-t">

                <button
                  onClick={() => router.back()}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                >
                  Back
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
