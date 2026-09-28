import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const updateDepartment = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();
    const id = body?.id;
    const DepartmentName = typeof body?.DepartmentName === "string" ? body.DepartmentName.trim() : "";
    const status = body?.status === undefined || body?.status === null ? 0 : Number(body.status);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID is required",
        },
        { status: 400 }
      );
    }

    if (!DepartmentName) {
      return NextResponse.json(
        {
          success: false,
          message: "Department name is required",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [existingRoles] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM departments WHERE id = ?`,
      [id]
    );

    if (existingRoles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Departments not found",
        },
        { status: 404 }
      );
    }

    await connection.query(
      `UPDATE departments SET DepartmentName = ?, status = ? WHERE id = ?`,
      [DepartmentName, Number.isNaN(status) ? 0 : status, id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Department updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Department Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update Department",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
