import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const getEmployees = async (req: NextRequest) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT
        id,
        emp_code,
        fname,
        mname,
        lname,
        email,
        contact_no,
        dob,
        joining_date,
        emp_photo,
        gender,
        managerid,
        team_lead_id,
        senior_emp_id,
        department,
        role,
        emp_cv,
        address_line1,
        address_line2,
        city,
        district,
        state,
        pincode,
        fixedsalary,
        created_at,
        updated_at,
        cl,
        salary_deduction,
        status,
        is_deleted
      FROM employees
      WHERE is_deleted = 0
      ORDER BY id DESC`
    );

    return NextResponse.json(
      {
        success: true,
        count: rows.length,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Employees Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employees",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};