/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id?: number;
    employee_id?: number;
}

export const getAttendanceStatus = async (
    req: NextRequest
) => {
    try {
        // -----------------------------------------
        // 1. Check Authorization Header
        // -----------------------------------------

        const authHeader =
            req.headers.get("authorization");

        console.log(
            "Authorization Header:",
            authHeader ? "Present" : "Missing"
        );

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unauthorized. Bearer token is missing.",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 2. Get Token
        // -----------------------------------------

        const token = authHeader.substring(7).trim();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Token is empty.",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 3. Check JWT Secret
        // -----------------------------------------

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error(
                "JWT_SECRET is missing in environment variables."
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Server configuration error: JWT_SECRET is missing.",
                },
                { status: 500 }
            );
        }

        // -----------------------------------------
        // 4. Verify JWT
        // -----------------------------------------

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(
                token,
                jwtSecret
            ) as JwtPayload;
        } catch (jwtError) {
            console.error(
                "JWT Verification Error:",
                jwtError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid or expired token.",
                },
                { status: 401 }
            );
        }

        console.log(
            "Decoded JWT:",
            decoded
        );

        // -----------------------------------------
        // 5. Get Employee ID
        // -----------------------------------------

        const employeeId =
            decoded.id ?? decoded.employee_id;

        if (!employeeId) {
            console.error(
                "Employee ID not found in JWT:",
                decoded
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Employee ID is missing from token.",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 6. Get Today's Attendance
        // -----------------------------------------

        const [rows]: any = await pool.query(
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
            AND DATE(date) = CURDATE()
            LIMIT 1
            `,
            [employeeId]
        );

        console.log(
            "Attendance rows:",
            rows
        );

        // -----------------------------------------
        // 7. Return Attendance
        // -----------------------------------------

        return NextResponse.json({
            success: true,
            attendance:
                rows.length > 0
                    ? rows[0]
                    : null,
        });

    } catch (error: any) {

        console.error(
            "Today's attendance error:"
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Code:",
            error?.code
        );

        console.error(
            "SQL Message:",
            error?.sqlMessage
        );

        console.error(
            "Stack:",
            error?.stack
        );

        console.error(
            "================================="
        );

        return NextResponse.json(
            {
                success: false,

                // Development debugging
                message:
                    process.env.NODE_ENV ===
                    "development"
                        ? error?.sqlMessage ||
                          error?.message ||
                          "Failed to get attendance"
                        : "Failed to get attendance",
            },
            { status: 500 }
        );
    }
};