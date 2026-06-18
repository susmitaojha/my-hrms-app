import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";

export const deleteEmployee = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();
    const { id } = body;

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

    // Soft delete employee
    await connection.query(
      `UPDATE employees SET is_deleted = 1, updated_at = NOW() WHERE id = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Employee deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Employee Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete employee",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
