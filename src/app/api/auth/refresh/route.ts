import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export async function POST(request: NextRequest) {
  try {
    const refresh_token = request.cookies.get("refresh_token")?.value;

    if (!refresh_token) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const response = await axios.post<RefreshResponse>("/auth/refresh", {
      accessToken: refresh_token,
      refreshToken: refresh_token,
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;

    // Update access token cookie
    const response_with_cookies = NextResponse.json({
      success: true,
      access_token: access_token,
      refresh_token: new_refresh_token,
    });

    console.log("Response with cookies", response_with_cookies);

    response_with_cookies.cookies.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    response_with_cookies.cookies.set({
      name: "refresh_token",
      value: new_refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response_with_cookies;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Token refresh failed" },
      { status: 401 }
    );
  }
}
