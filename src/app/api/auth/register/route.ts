import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";
import { User } from "@/types";

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phoneNumber, merchant } =
      body;

    console.log("Fix Router: ", body);

    const response = await axios.post<RegisterResponse>("/auth/register", {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      merchant,
    });

    const { accessToken, refreshToken } = response.data;

    // Set cookies
    const response_with_cookies = NextResponse.json({
      success: true,
      user: response.data.user,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    response_with_cookies.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    response_with_cookies.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response_with_cookies;
  } catch (error: any) {
    console.error("Backend registration error:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Registration failed" },
      { status: 401 }
    );
  }
}
