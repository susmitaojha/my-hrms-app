import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import fs from "fs";
import path from "path";
import { isValidImageMimeType, deleteFileSafely } from "../../../lib/file_helpers";

export const updateEmployee = async (req: NextRequest) => {
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
      id,
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
      remove_photo,
    } = fields;

    // Validation
    if (!id || !fname || !lname || !email || !department || !role) {
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

    connection = await pool.getConnection();

    // Check if employee exists
    const [existingEmployee]: any = await connection.query(
      `SELECT id, emp_photo FROM employees WHERE id = ? AND is_deleted = 0`,
      [id]
    );

    if ((existingEmployee as any[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    const oldPhotoPath = existingEmployee[0].emp_photo;
    let empPhotoDbPath = oldPhotoPath;

    // Determine target scenario: Case 1, 2, or 3
    if (remove_photo === "true") {
      // Case 3: Image removed
      deleteFileSafely(oldPhotoPath);
      empPhotoDbPath = null;
    } else if (file && file.size > 0) {
      // Case 2: New image selected
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

      // 3. Delete old file if it exists
      deleteFileSafely(oldPhotoPath);

      // 4. Save new file
      const uploadDir = path.join(process.cwd(), "public", "uploads", "employees");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFilename = `employee_${Date.now()}_${Math.floor(Math.random() * 1000000)}.${mimeCheck.ext}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      empPhotoDbPath = `uploads/employees/${uniqueFilename}`;
    }
    // Case 1: No changes made (empPhotoDbPath remains oldPhotoPath)

    // Update employee
    await connection.query(
      `UPDATE employees SET
        fname = ?,
        mname = ?,
        lname = ?,
        email = ?,
        contact_no = ?,
        dob = ?,
        joining_date = ?,
        gender = ?,
        emp_photo = ?,
        managerid = ?,
        team_lead_id = ?,
        senior_emp_id = ?,
        department = ?,
        role = ?,
        address_line1 = ?,
        address_line2 = ?,
        city = ?,
        district = ?,
        state = ?,
        pincode = ?,
        fixedsalary = ?,
        cl = ?,
        salary_deduction = ?,
        status = ?,
        updated_at = NOW()
      WHERE id = ?`,
      [
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
        id,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Employee updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Employee Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update employee",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
