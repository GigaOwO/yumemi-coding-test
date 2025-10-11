import { NextResponse } from "next/server";
import { PrefectureResponse } from "@/features/prefecture/types";

/**
 * 都道府県一覧を取得するAPIルートハンドラ
 * APIからデータを取得し、クライアントに返す
 */
export async function GET() {
  try {
    const apiUrl = process.env.API_URL;
    const apiKey = process.env.API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: "API configuration is missing" },
        { status: 500 }
      );
    }

    const res = await fetch(`${apiUrl}/api/v1/prefectures`, {
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      // キャッシュ戦略: 1時間キャッシュ
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prefectures from external API" },
        { status: res.status }
      );
    }

    const data: PrefectureResponse = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching prefectures:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
