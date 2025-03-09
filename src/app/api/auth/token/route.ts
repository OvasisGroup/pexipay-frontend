import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";
import { jwtDecode } from "jwt-decode";

interface User {
  accessToken: string;
  refreshToken: string;
}

export async function GET(request: NextRequest) {
  try {
    const access_token = request.cookies.get("access_token")?.value;
    const refresh_token = request.cookies.get("refresh_token")?.value;

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      // Verify token expiration
      const decoded = jwtDecode<{ exp: number }>(access_token);
      if (decoded.exp < Date.now() / 1000) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get user data from backend
    const response = await axios.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return NextResponse.json({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to get user data" },
      { status: error.response?.status || 500 }
    );
  }
}
