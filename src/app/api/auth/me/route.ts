import { NextRequest, NextResponse } from "next/server";
import axios from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/models";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;

    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      // Verify token expiration
      const decoded = jwtDecode<{ exp: number }>(accessToken);
      if (decoded.exp < Date.now() / 1000) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("Access Token: ", accessToken);

    // Get user data from backend
    const { data } = await axios.get("/auth/current-user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const resp = {
      user: (data as any).user as User,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    console.log("Auth Info: ", resp);

    return NextResponse.json(resp);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to get user data" },
      { status: error.response?.status || 500 }
    );
  }
}
