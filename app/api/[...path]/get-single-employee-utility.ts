import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const getSingleEmployee = async (req: NextRequest) => {
  let connection;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const query = `
      SELECT
          e.id,
          e.emp_code,
          e.fname,
          e.mname,
          e.lname,
          CONCAT(e.fname, ' ', IFNULL(e.mname, ''), ' ', e.lname) AS employee_name,
          e.email,
          e.contact_no,
          e.dob,
          e.joining_date,
          e.emp_photo,
          e.gender,

          d.DepartmentName AS department_name,
          r.role_name,

          CONCAT(tl.fname, ' ', IFNULL(tl.mname, ''), ' ', tl.lname) AS team_leader_name,
          tl.emp_code AS team_leader_code,

          e.address_line1,
          e.address_line2,
          e.city,
          e.district,
          e.state,
          e.pincode,
          e.fixedsalary,
          e.cl,
          e.salary_deduction,
          e.status,
          e.emp_cv,
          ess.salary_type,
          ess.basic_salary,
          ess.hra,
          ess.da,
          ess.conveyance,
          ess.medical,
          ess.special_allowance,
          ess.gross_salary,
          ess.pf_applicable,
          ess.esi_applicable,
          ess.professional_tax,
          ess.tds_applicable,
          ess.bank_account,
          ess.status AS salary_structure_status,
          e.created_at,
          e.updated_at

      FROM employees e

      LEFT JOIN departments d
          ON e.department = d.id

      LEFT JOIN roles r
          ON e.role = r.id

      LEFT JOIN employees tl
          ON e.team_lead_id = tl.id

      LEFT JOIN employee_salary_structures ess
          ON e.id = ess.employee_id

      WHERE e.id = ?
      AND e.is_deleted = 0

      LIMIT 1;
      `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Single Employee Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employee",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
