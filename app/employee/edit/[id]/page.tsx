'use client'

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';

interface EmployeeFormData {
    id?: number;
    emp_photo?: string;
    fname: string;
    mname: string;
    lname: string;
    email: string;
    contact_no: string;
    dob: string;
    joining_date: string;
    gender: string;
    team_lead_id: number | null;
    senior_emp_id: number | null;
    department: string;
    role: string;
    address_line1: string;
    address_line2: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    fixedsalary: number;
    cl: number;
    salary_deduction: number;
    status: number;
}
interface SalaryStructureFormData {
    salary_type: string | null;

    basic_salary: number | null;
    hra: number | null;
    da: number | null;
    conveyance: number | null;
    medical: number | null;
    special_allowance: number | null;
    gross_salary: number | null;

    pf_applicable: number | null;
    esi_applicable: number | null;
    professional_tax: number | null;
    tds_applicable: number | null;

    bank_account: string | null;

    salary_structure_status: number | null;
}

interface Department {
    id: number;
    DepartmentName: string;
}
interface Role {
    id: number;
    role_name: string;
}
interface TeamLead {
    id: number;
    fname: string;
    lname: string;
}

export default function EditEmployee() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [teamLeads, setTeamLeads] = useState<TeamLead[]>([]);
    const [salaryStructure, setSalaryStructure] = useState<SalaryStructureFormData>({
        salary_type: null,
        basic_salary: null,
        hra: null,
        da: null,
        conveyance: null,
        medical: null,
        special_allowance: null,
        gross_salary: null,
        pf_applicable: null,
        esi_applicable: null,
        professional_tax: null,
        tds_applicable: null,
        bank_account: null,
        salary_structure_status: 1,
    });

    const [formData, setFormData] = useState<EmployeeFormData>({
        fname: '',
        mname: '',
        lname: '',
        email: '',
        contact_no: '',
        dob: '',
        joining_date: '',
        gender: 'Male',
        team_lead_id: null,
        senior_emp_id: null,
        department: '',
        role: '',
        address_line1: '',
        address_line2: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        fixedsalary: 0,
        cl: 0,
        salary_deduction: 0,
        status: 1,
    });

    // Fetch employee data
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get('/api/getSingleEmployee', {
                    params: { id },
                });

                if (res.data.success) {
                    const employee = res.data.data;
                    setFormData({
                        ...employee,
                        dob: employee.dob
                            ? new Date(employee.dob).toISOString().split("T")[0]
                            : "",
                        joining_date: employee.joining_date
                            ? new Date(employee.joining_date).toISOString().split("T")[0]
                            : "",
                    });
                    setSalaryStructure({
                        salary_type: employee.salary_type || 'Monthly',
                        basic_salary: Number(employee.basic_salary ?? 0),
                        hra: Number(employee.hra ?? 0),
                        da: Number(employee.da ?? 0),
                        conveyance: Number(employee.conveyance ?? 0),
                        medical: Number(employee.medical ?? 0),
                        special_allowance: Number(employee.special_allowance ?? 0),
                        gross_salary: Number(employee.gross_salary ?? 0),
                        pf_applicable: Number(employee.pf_applicable ?? 0),
                        esi_applicable: Number(employee.esi_applicable ?? 0),
                        professional_tax: Number(employee.professional_tax ?? 0),
                        tds_applicable: Number(employee.tds_applicable ?? 0),
                        bank_account: employee.bank_account || '',
                        salary_structure_status: Number(employee.salary_structure_status ?? 1),
                    });
                } else {
                    toast.error('Failed to load employee data');
                    router.push('/employees');
                }
            } catch (error) {
                console.error('Error fetching employee:', error);
                toast.error('Error loading employee');
                router.push('/employees');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEmployee();
        }
    }, [id, router]);


    // Fetch Department List
    const fetchDepartments = async () => {
        try {
            const res = await axios.get("/api/getDepartments");

            if (res.data.success) {
                setDepartments(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load departments");
        }
    };

    // Load departments when page opens
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Fetch Role List
    const fetchRoles = async () => {
        try {
            const res = await axios.get("/api/getRoles");

            if (res.data.success) {
                setRoles(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load roles");
        }
    };

    // Load roles when page opens
    useEffect(() => {
        fetchRoles();
    }, []);

    // Fetch Team Leads List
    const fetchTeamLeads = async () => {
        try {
            const res = await axios.get("/api/getTeamLeads");

            if (res.data.success) {
                setTeamLeads(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load team leads");
        }
    };

    // Load team leads when page opens
    useEffect(() => {
        fetchTeamLeads();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? (value ? Number(value) : 0) : value,
        });
    };

    const handleSalaryChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setSalaryStructure((prev) => ({
            ...prev,
            [name]: type === "number"
                ? (value === "" ? null : Number(value))
                : value,
        }));
    };
    const handleSalaryCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSalaryStructure((prev) => ({
            ...prev,
            [name]: checked ? 1 : 0,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
            toast.error('Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.');
            return;
        }

        // Validate size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size exceeds the 2 MB limit.');
            return;
        }

        setSelectedFile(file);
        setRemovePhoto(false);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setRemovePhoto(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.fname.trim() || !formData.lname.trim() || !formData.email.trim() || !formData.department || !formData.role) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    // Do not submit emp_photo field value directly as it is handled via the file
                    if (key !== 'emp_photo') {
                        submitData.append(key, value.toString());
                    }
                }
            });

            Object.entries(salaryStructure).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitData.append(key, value.toString());
                }
            });

            if (selectedFile) {
                submitData.append('emp_photo', selectedFile);
            }

            if (removePhoto) {
                submitData.append('remove_photo', 'true');
            }

            const res = await axios.post('/api/updateEmployee', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                toast.success('Employee updated successfully!');
                router.push('/employees');
            } else {
                toast.error(res.data.message || 'Failed to update employee');
            }
        } catch (error: any) {
            console.error('Error updating employee:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Server error while updating employee');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const displayImageSrc = (selectedFile && previewUrl)
        ? previewUrl
        : (formData.emp_photo && !removePhoto)
            ? (formData.emp_photo.startsWith('uploads/') ? `/${formData.emp_photo}` : `/uploads/employees/${formData.emp_photo}`)
            : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading employee data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <Link href="/employees" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Edit Employee
                            <span className="text-lg font-normal text-green-400 ml-2">
                                ({formData.fname} {formData.lname})
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fname"
                                        value={formData.fname}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Middle Name
                                    </label>
                                    <input
                                        type="text"
                                        name="mname"
                                        value={formData.mname ?? ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lname"
                                        value={formData.lname}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact No
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_no"
                                        value={formData.contact_no || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob ? formData.dob.split("T")[0] : ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Profile Photo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        {/* Preview Box */}
                                        <div className="w-[150px] h-[150px] relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden shrink-0">
                                            {displayImageSrc ? (
                                                <img
                                                    src={displayImageSrc}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center p-3">
                                                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-1" />
                                                    <span className="block text-xs font-semibold text-gray-500">Profile Photo</span>
                                                    <span className="block text-[10px] text-gray-400 mt-0.5">150 x 150</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions and details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {!displayImageSrc ? (
                                                    <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer font-medium text-sm transition">
                                                        <Upload size={14} />
                                                        Upload Image
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                ) : (
                                                    <>
                                                        <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer font-medium text-sm transition">
                                                            <Upload size={14} />
                                                            Change Image
                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveImage}
                                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg font-medium text-sm transition"
                                                        >
                                                            <X size={14} />
                                                            Remove Image
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500 space-y-1.5 border-t border-gray-100 pt-3">
                                                <div>
                                                    <span className="font-semibold text-gray-600">Supported:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {['JPG', 'JPEG', 'PNG', 'WEBP'].map((ext) => (
                                                            <span key={ext} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase">{ext}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-[11px]">
                                                    <span className="font-semibold text-gray-600">Maximum Size:</span> 2 MB
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Employment Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department *
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Department</option>

                                        {departments.map((dept) => (
                                            <option
                                                key={dept.id}
                                                value={dept.id}>
                                                {dept.DepartmentName}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role *
                                    </label>
                                    <select
                                        name="role" value={formData.role} onChange={handleChange} required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.id}>
                                                {role.role_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Joining Date
                                    </label>
                                    <input
                                        type="date"
                                        name="joining_date"
                                        value={formData.joining_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team Lead ID
                                    </label>
                                    <select
                                        name="team_lead_id"
                                        value={formData.team_lead_id ?? ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Team Lead</option>
                                        {teamLeads.map((lead) => (
                                            <option key={lead.id} value={lead.id}>
                                                {lead.fname} {lead.lname}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fixed Salary
                                    </label>
                                    <input
                                        type="text"
                                        name="fixedsalary"
                                        value={formData.fixedsalary}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Casual Leave (CL)
                                    </label>
                                    <input
                                        type="number"
                                        name="cl"
                                        value={formData.cl}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salary Deduction
                                    </label>
                                    <input
                                        type="text"
                                        name="salary_deduction"
                                        value={formData.salary_deduction}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={0}>Active</option>
                                        <option value={1}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Address Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        name="address_line1"
                                        value={formData.address_line1}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="address_line2"
                                        value={formData.address_line2}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Salary Structure */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Salary Structure</h2>
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salary Type
                                        </label>
                                        <select
                                            name="salary_type"
                                            value={salaryStructure.salary_type}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Hourly">Hourly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Basic Salary
                                        </label>
                                        <input
                                            type="number"
                                            name="basic_salary"
                                            value={salaryStructure.basic_salary ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            HRA
                                        </label>
                                        <input
                                            type="number"
                                            name="hra"
                                            value={salaryStructure.hra ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            DA
                                        </label>
                                        <input
                                            type="number"
                                            name="da"
                                            value={salaryStructure.da ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Conveyance
                                        </label>
                                        <input
                                            type="number"
                                            name="conveyance"
                                            value={salaryStructure.conveyance ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Medical
                                        </label>
                                        <input
                                            type="number"
                                            name="medical"
                                            value={salaryStructure.medical ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Special Allowance
                                        </label>
                                        <input
                                            type="number"
                                            name="special_allowance"
                                            value={salaryStructure.special_allowance ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gross Salary
                                        </label>
                                        <input
                                            type="number"
                                            name="gross_salary"
                                            value={salaryStructure.gross_salary ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Professional Tax
                                        </label>
                                        <input
                                            type="number"
                                            name="professional_tax"
                                            value={salaryStructure.professional_tax ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bank Account
                                        </label>
                                        <input
                                            type="text"
                                            name="bank_account"
                                            value={salaryStructure.bank_account ?? ""}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            name="salary_structure_status"
                                            value={salaryStructure.salary_structure_status}
                                            onChange={handleSalaryChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={1}>Active</option>
                                            <option value={0}>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            name="pf_applicable"
                                            checked={salaryStructure.pf_applicable === 1}
                                            onChange={handleSalaryCheckboxChange}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        PF Applicable
                                    </label>

                                    <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            name="esi_applicable"
                                            checked={salaryStructure.esi_applicable === 1}
                                            onChange={handleSalaryCheckboxChange}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        ESI Applicable
                                    </label>

                                    <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            name="tds_applicable"
                                            checked={salaryStructure.tds_applicable === 1}
                                            onChange={handleSalaryCheckboxChange}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        TDS Applicable
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end">
                            <Link
                                href="/employees"
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
