import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";

export async function addRole(req: NextRequest) {
    let connection;

    try {
        const { role_name, status } = await req.json();

        if (!role_name?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Role name required",
                },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        const [exists] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM roles WHERE role_name = ?",
            [role_name.trim()]
        );

        if (exists.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Role already exists",
                },
                { status: 409 }
            );
        }

        const [result]: any = await connection.query(
            `INSERT INTO roles
             (role_name,status,created_at)
             VALUES (?, ?, NOW())`,
            [role_name.trim(), Number(status)]
        );

        return NextResponse.json({
            success: true,
            id: result.insertId,
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
