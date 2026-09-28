import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

interface JwtPayload {
    id: number;
    email: string;
}

export const getAttendanceStatus = async (req: NextRequest) => {
    let connection;

    try {
        // ---------------------------------------
        // 1. Get token
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
        // 2. Verify token
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

        // ---------------------------------------
        // 3. DB connection
        // ---------------------------------------
        connection = await pool.getConnection();

        // ---------------------------------------
        // 4. Get today's attendance
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
        // 5. No attendance
        // ---------------------------------------
        if (rows.length === 0) {
            return NextResponse.json(
                {
                    attendance: null,
                    checkedIn: false,
                    checkedOut: false,
                },
                { status: 200 }
            );
        }

        const attendance = rows[0];

        // ---------------------------------------
        // 6. Attendance exists
        // ---------------------------------------
        return NextResponse.json(
            {
                attendance,
                checkedIn: true,
                checkedOut: attendance.exit_time !== null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get attendance status error:", error);

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