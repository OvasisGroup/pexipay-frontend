import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    // Clear auth cookies
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to logout" },
      { status: error.response?.status || 500 }
    );
  }
}
