import dbConnect from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import bcryptjs from "bcryptjs";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    console.log(username, email, password);
    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    // hash the password

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
