/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const postLoginUser = async (req: NextRequest) => {
  let connection;

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is missing in environment variables.");

      return NextResponse.json(
        {
          message: "Server configuration error: JWT_SECRET is missing.",
        },
        { status: 500 }
      );
    }

    const { email, password, role } = await req.json();

    // Validation
    if (!email || !password || !role) {
      return NextResponse.json(
        {
          message: "Email, password and role are required",
        },
        { status: 400 }
      );
    }

    // Only allow valid roles
    if (!["admin", "employee"].includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid role",
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    let user: any = null;
    if (role === "admin") {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
          id,
          name,
          email,
          role,
          email_verified_at,
          password
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          {
            message: "Admin account not found",
          },
          { status: 401 }
        );
      }

      user = rows[0];
    }
    else if (role === "employee") {
      const [rows] = await connection.query<RowDataPacket[]>(
        `SELECT 
          id,
          emp_code,
          fname,
          mname,
          lname,
          email,
          password
         FROM employees
         WHERE email = ?
         AND is_deleted = 0
         LIMIT 1`,
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          {
            message: "Employee account not found",
          },
          { status: 401 }
        );
      }

      user = rows[0];
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid password",
        },
        { status: 401 }
      );
    }

    let userName = "";

    if (role === "admin") {
      userName = user.name;
    } else {
      userName = [
        user.fname,
        user.mname,
        user.lname,
      ]
        .filter(Boolean)
        .join(" ");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: role,
      },
      jwtSecret,
      {
        expiresIn: "2h",
      }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,

        user: {
          id: user.id,
          name: userName,
          email: user.email,
          role: role,

          ...(role === "employee" && {
            emp_code: user.emp_code,
          }),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

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