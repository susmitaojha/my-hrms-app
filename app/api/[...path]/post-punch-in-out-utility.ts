import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import pool from "../../../db";

interface JwtPayload {
  id?: number;
}

interface AttendanceRow extends RowDataPacket {
  id: number;
  entry_time: string | null;
  exit_time: string | null;
}

export const postPunchInOut = async (
  req: NextRequest,
  action: "punchIn" | "punchOut"
) => {
  let connection;

  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice("Bearer ".length).trim();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token not found" },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing in environment variables.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error: JWT_SECRET is missing.",
        },
        { status: 500 }
      );
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (error) {
      console.warn("Punch request rejected an invalid JWT:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token. Please sign in again.",
        },
        { status: 401 }
      );
    }

    const employeeId = decoded.id;

    if (!Number.isInteger(employeeId) || !employeeId || employeeId < 1) {
      return NextResponse.json(
        { success: false, message: "Employee ID is missing from token." },
        { status: 401 }
      );
    }

    connection = await pool.getConnection();

    if (action === "punchIn") {
      const [rows] = await connection.query<AttendanceRow[]>(
        `
        SELECT id, entry_time, exit_time
        FROM attendances
        WHERE employee_id = ?
          AND date = CURDATE()
        ORDER BY id DESC
        LIMIT 1
        `,
        [employeeId]
      );

      if (rows[0]?.entry_time) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already punched in today.",
            attendance: rows[0],
          },
          { status: 400 }
        );
      }

      const [result] = await connection.query<ResultSetHeader>(
        `
        INSERT INTO attendances
          (employee_id, date, entry_time, exit_time, status, created_at, updated_at)
        VALUES
          (?, CURDATE(), CURTIME(), NULL, 'Present', NOW(), NOW())
        `,
        [employeeId]
      );

      return NextResponse.json({
        success: true,
        message: "Punch In successful.",
        attendanceId: result.insertId,
      });
    }

    if (action === "punchOut") {
      const [rows] = await connection.query<AttendanceRow[]>(
        `
        SELECT id, entry_time, exit_time
        FROM attendances
        WHERE employee_id = ?
          AND date = CURDATE()
        ORDER BY id DESC
        LIMIT 1
        `,
        [employeeId]
      );

      const attendance = rows[0];

      if (!attendance?.entry_time) {
        return NextResponse.json(
          { success: false, message: "You have not punched in today." },
          { status: 400 }
        );
      }

      if (attendance.exit_time) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already punched out today.",
            attendance,
          },
          { status: 400 }
        );
      }

      const [result] = await connection.query<ResultSetHeader>(
        `
        UPDATE attendances
        SET exit_time = CURTIME(),
            status = 'Completed',
            updated_at = NOW()
        WHERE id = ?
          AND employee_id = ?
          AND exit_time IS NULL
        `,
        [attendance.id, employeeId]
      );

      if (result.affectedRows !== 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Attendance was updated by another request. Please refresh.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Punch Out successful.",
        attendanceId: attendance.id,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid attendance action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Punch In/Out error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
};
