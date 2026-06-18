import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";


export const addEmployee = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();

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
    } = body;

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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        emp_code,
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
