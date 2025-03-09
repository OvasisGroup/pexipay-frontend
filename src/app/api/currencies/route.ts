import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const response = await fetch(
      `${process.env.BACKEND_URL}/currencies?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch currencies");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CURRENCIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
