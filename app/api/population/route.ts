import { NextRequest, NextResponse } from "next/server";
import { PopulationCompositionPerYearResponse } from "@/features/population/types";

/**
 * 人口構成データを取得するAPIルートハンドラ
 * APIからデータを取得し、クライアントに返す
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefCode = searchParams.get("prefCode");

    if (!prefCode) {
      return NextResponse.json(
        { error: "Prefecture code is required" },
        { status: 400 }
      );
    }

    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `${apiUrl}/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        // キャッシュ戦略: 人口データは頻繁に変わらないため24時間キャッシュ
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch population data from external API" },
        { status: res.status }
      );
    }

    const data: PopulationCompositionPerYearResponse = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching population data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
