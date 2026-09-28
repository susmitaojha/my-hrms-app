import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export const getAttendances = async (req: NextRequest) => {
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query<RowDataPacket[]>(
            `SELECT
                a.id,
                a.employee_id,

                e.emp_code,
                e.fname,
                e.mname,
                e.lname,
                e.email,

                a.date,
                a.entry_time,
                a.exit_time,
                a.status,
                a.created_at,
                a.updated_at

            FROM attendances a

            LEFT JOIN employees e
                ON e.id = a.employee_id

            ORDER BY a.date DESC, a.id DESC`
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
        console.error("Get Attendances Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch attendance records",
            },
            { status: 500 }
        );

    } finally {
        if (connection) {
            connection.release();
        }
    }
};