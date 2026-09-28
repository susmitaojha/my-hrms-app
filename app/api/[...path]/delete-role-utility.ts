import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const deleteRole = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const [existingRoles] = await connection.query<RowDataPacket[]>(
      `SELECT id FROM roles WHERE id = ?`,
      [id]
    );

    if (existingRoles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Role not found",
        },
        { status: 404 }
      );
    }

    await connection.query(
      `UPDATE roles SET status = 1 WHERE id = ?`,
      [id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Role deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Role Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete role",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
