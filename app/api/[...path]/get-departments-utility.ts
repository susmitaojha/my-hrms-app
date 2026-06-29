import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const getDepartments = async (req: NextRequest) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT id, DepartmentName FROM departments
      ORDER BY DepartmentName ASC`);

        return NextResponse.json(
            {
                success: true,
                count: rows.length,
                data: rows,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get Departments Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch departments",
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};