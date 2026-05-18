import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';


const connection = await pool.getConnection();
export const postRegisterUser = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    // ✅ validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { status: 400, message: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ STEP: hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("hashedPassword:", hashedPassword);

    // ✅ store in DB (example)
    const [rows] = await connection.query(
      "INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())",
      [name, email, hashedPassword]
    );

    return NextResponse.json({
      status: 200,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { status: 500, message: "Server error" },
      { status: 500 }
    );
  }
};