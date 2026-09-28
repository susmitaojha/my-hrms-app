import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const getRoles = async (req: NextRequest) => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT id, role_name, created_at, status
       FROM roles
       ORDER BY role_name ASC`
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
    console.error("Get Roles Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch roles",
      },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
};