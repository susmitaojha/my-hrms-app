import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const deleteDepartment = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Department ID is required",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Check if department exists
    const [existingDepartment] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM departments WHERE id = ?`,
      [id]
    );

    if (existingDepartment.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Department not found",
        },
        { status: 404 }
      );
    }

    // Soft Delete (status = 1)
    await connection.query(
      `UPDATE departments SET status = 1 WHERE id = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Department deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Department Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete department",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};