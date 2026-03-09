import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(value: string): string {
  return value.includes("\\n") ? value.replace(/\\n/g, "\n") : value;
}

export async function GET() {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID ?? "1WqZbfMToXVX1D-oZaYpFHeeuaoFrzIR1sTkQLTaJM_w";

    const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = normalizePrivateKey(getEnv("GOOGLE_PRIVATE_KEY"));

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.get({ spreadsheetId: sheetId });

    return NextResponse.json({
      ok: true,
      spreadsheetId: res.data.spreadsheetId,
      title: res.data.properties?.title ?? null,
      sheetNames: (res.data.sheets ?? []).map((s) => s.properties?.title).filter(Boolean)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sheets health check failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
