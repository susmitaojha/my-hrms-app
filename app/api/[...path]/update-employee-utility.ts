import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";

export const updateEmployee = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();

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
    } = body;

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

    connection = await pool.getConnection();

    // Check if employee exists
    const [existingEmployee] = await connection.query(
      `SELECT id FROM employees WHERE id = ? AND is_deleted = 0`,
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
