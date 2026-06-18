import dbConnect from "@/dbConnect/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
dbConnect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log(email, password);
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User does not exist" },
        { status: 400 }
      );
    }
    // check if password is correct
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }
    // create a token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
