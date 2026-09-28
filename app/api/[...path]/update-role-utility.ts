import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const updateRole = async (req: NextRequest) => {
  let connection;

  try {
    const body = await req.json();
    const id = body?.id;
    const role_name = typeof body?.role_name === "string" ? body.role_name.trim() : "";
    const status = body?.status === undefined || body?.status === null ? 0 : Number(body.status);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Role ID is required",
        },
        { status: 400 }
      );
    }

    if (!role_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Role name is required",
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
      `UPDATE roles SET role_name = ?, status = ? WHERE id = ?`,
      [role_name, Number.isNaN(status) ? 0 : status, id]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Role updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Role Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update role",
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
};
