import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import fs from "fs";
import path from "path";
import { isValidImageMimeType } from "../../../lib/file_helpers";

export const addEmployee = async (req: NextRequest) => {
  let connection;

  try {
    let fields: any = {};
    let file: File | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          file = value;
        } else {
          fields[key] = value;
        }
      }
    } else {
      fields = await req.json();
    }

    const {
      fname,
      mname,
      lname,
      email,
      contact_no,
      dob,
      joining_date,
      gender,
      managerid,
      team_lead_id,
      senior_emp_id,
      department,
      role,
      address_line1,
      address_line2,
      city,
      district,
      state,
      pincode,
      fixedsalary,
      cl,
      salary_deduction,
      status,
    } = fields;

    // Validation
    if (!fname || !lname || !email || !department || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    // Helper functions for numeric conversion
    const getNum = (val: any) => {
      if (val === undefined || val === null || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };
    
    const getInt = (val: any, defaultVal = 0) => {
      if (val === undefined || val === null || val === '') return defaultVal;
      const num = parseInt(val, 10);
      return isNaN(num) ? defaultVal : num;
    };

    // Handle Image Upload and Validation
    let empPhotoDbPath: string | null = null;
    if (file && file.size > 0) {
      // 1. Size Validation (2 MB limit)
      if (file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "File size exceeds the 2 MB limit.",
          },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // 2. MIME Type Verification using file magic bytes signature
      const mimeCheck = isValidImageMimeType(buffer);
      if (!mimeCheck.isValid || !mimeCheck.ext) {
        return NextResponse.json(
          {
            success: false,
            message: "Unsupported or invalid file format. Only JPG, JPEG, PNG, and WEBP are allowed.",
          },
          { status: 400 }
        );
      }

      // 3. Save file locally with unique name
      const uploadDir = path.join(process.cwd(), "public", "uploads", "employees");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFilename = `employee_${Date.now()}_${Math.floor(Math.random() * 1000000)}.${mimeCheck.ext}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      empPhotoDbPath = `uploads/employees/${uniqueFilename}`;
    }

    connection = await pool.getConnection();

    // Check if email already exists
    const [existingEmail] = await connection.query(
      `SELECT id FROM employees WHERE email = ? AND is_deleted = 0`,
      [email]
    );

    if ((existingEmail as any[]).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    // Get last employee ID
    const [lastEmployee]: any = await connection.query(
      `SELECT id FROM employees ORDER BY id DESC LIMIT 1`
    );

    const nextId =
      lastEmployee.length > 0
        ? Number(lastEmployee[0].id) + 1
        : 1;

    // Generate Employee Code
    const emp_code = `EMP-${String(nextId).padStart(4, "0")}`;

    // Insert new employee
    const result = await connection.query(
      `INSERT INTO employees (
        emp_code,
        fname,
        mname,
        lname,
        email,
        contact_no,
        dob,
        joining_date,
        gender,
        emp_photo,
        managerid,
        team_lead_id,
        senior_emp_id,
        department,
        role,
        address_line1,
        address_line2,
        city,
        district,
        state,
        pincode,
        fixedsalary,
        cl,
        salary_deduction,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        emp_code,
        fname,
        mname || null,
        lname,
        email,
        contact_no || null,
        dob || null,
        joining_date || null,
        gender || 'Male',
        empPhotoDbPath,
        getNum(managerid),
        getNum(team_lead_id),
        getNum(senior_emp_id),
        department,
        role,
        address_line1 || null,
        address_line2 || null,
        city || null,
        district || null,
        state || null,
        getNum(pincode),
        fixedsalary !== undefined && fixedsalary !== null ? String(fixedsalary) : null,
        getInt(cl, 5),
        getInt(salary_deduction, 0),
        getInt(status, 1),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Employee created successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Employee Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create employee",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
