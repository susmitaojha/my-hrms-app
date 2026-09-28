import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

interface JwtPayload {
    id: number;
    email: string;
}

export const addAttendance = async (req: NextRequest) => {
    let connection;

    try {
        // ---------------------------------------
        // 1. Get Authorization header
        // ---------------------------------------
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    message: "Unauthorized. Token required.",
                },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // ---------------------------------------
        // 2. Verify JWT
        // ---------------------------------------
        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(
                token,
                JWT_SECRET
            ) as JwtPayload;
        } catch (error) {
            return NextResponse.json(
                {
                    message: "Invalid or expired token.",
                },
                { status: 401 }
            );
        }

        const employeeId = decoded.id;

        if (!employeeId) {
            return NextResponse.json(
                {
                    message: "User ID not found in token.",
                },
                { status: 401 }
            );
        }

        // ---------------------------------------
        // 3. Database connection
        // ---------------------------------------
        connection = await pool.getConnection();

        // ---------------------------------------
        // 4. Check today's attendance
        // ---------------------------------------
        const [rows] = await connection.query<RowDataPacket[]>(
            `
            SELECT
                id,
                employee_id,
                date,
                entry_time,
                exit_time,
                status
            FROM attendances
            WHERE employee_id = ?
              AND date = CURDATE()
            LIMIT 1
            `,
            [employeeId]
        );

        // ---------------------------------------
        // 5. No attendance today
        // ---------------------------------------
        if (rows.length === 0) {
            await connection.query(
                `
                INSERT INTO attendances
                (
                    employee_id,
                    date,
                    entry_time,
                    status,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    ?,
                    CURDATE(),
                    CURTIME(),
                    'Present',
                    NOW(),
                    NOW()
                )
                `,
                [employeeId]
            );

            return NextResponse.json(
                {
                    message: "Attendance In successfully.",
                    type: "in",
                },
                { status: 200 }
            );
        }

        // ---------------------------------------
        // 6. Attendance already exists
        // ---------------------------------------
        const attendance = rows[0];

        // Already logged out
        if (attendance.exit_time) {
            return NextResponse.json(
                {
                    message: "Attendance already completed for today.",
                    type: "completed",
                    attendance,
                },
                { status: 400 }
            );
        }

        // ---------------------------------------
        // 7. Update exit time
        // ---------------------------------------
        await connection.query(
            `
            UPDATE attendances
            SET
                exit_time = CURTIME(),
                status = 'Completed',
                updated_at = NOW()
            WHERE id = ?
            `,
            [attendance.id]
        );

        return NextResponse.json(
            {
                message: "Attendance Out successfully.",
                type: "out",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Attendance error:", error);

        return NextResponse.json(
            {
                message: "Server error",
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
};