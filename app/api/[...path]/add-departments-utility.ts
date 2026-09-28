import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export async function addDepartment(req: NextRequest) {
    let connection;

    try {
        const { DepartmentName, status } = await req.json();

        // Validation
        if (!DepartmentName?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department name required",
                },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        // Check duplicate department
        const [exists] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM departments WHERE DepartmentName = ?",
            [DepartmentName.trim()]
        );

        if (exists.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department already exists",
                },
                { status: 409 }
            );
        }

        // Insert department
        const [result]: any = await connection.query(
            `INSERT INTO departments
            (DepartmentName, status, created_at)
            VALUES (?, ?, NOW())`,
            [DepartmentName.trim(), Number(status)]
        );

        return NextResponse.json({
            success: true,
            id: result.insertId,
            message: "Department created successfully",
        });

    } catch (err: any) {
        console.error(err);

        return NextResponse.json(
            {
                success: false,
                message: err.message,
            },
            { status: 500 }
        );
    } finally {
        connection?.release();
    }
}