import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { ADMIN_COOKIE_NAME, isAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "data");
const reservationsFile = path.join(dataDir, "reservations.json");

type ReservationPayload = {
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
};

type ReservationRecord = ReservationPayload & {
  id: string;
  source: string;
  submittedAt: string;
};

function isValidPayload(body: unknown): body is ReservationPayload {
  if (!body || typeof body !== "object") return false;

  const payload = body as Record<string, unknown>;
  return (
    typeof payload.name === "string" &&
    payload.name.trim().length > 0 &&
    typeof payload.phone === "string" &&
    payload.phone.trim().length > 0 &&
    typeof payload.guests === "number" &&
    Number.isFinite(payload.guests) &&
    payload.guests > 0 &&
    typeof payload.date === "string" &&
    payload.date.trim().length > 0 &&
    typeof payload.time === "string" &&
    payload.time.trim().length > 0
  );
}

function normalizePrivateKey(value: string): string {
  return value.includes("\\n") ? value.replace(/\\n/g, "\n") : value;
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(reservationsFile);
  } catch {
    await fs.writeFile(reservationsFile, "[]", "utf8");
  }
}

async function readReservations(): Promise<ReservationRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(reservationsFile, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? (parsed as ReservationRecord[]) : [];
}

async function writeReservations(rows: ReservationRecord[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(reservationsFile, JSON.stringify(rows, null, 2), "utf8");
}

async function appendToGoogleSheet(record: ReservationRecord): Promise<boolean> {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID ?? "1WqZbfMToXVX1D-oZaYpFHeeuaoFrzIR1sTkQLTaJM_w";
  const sheetRange = process.env.GOOGLE_SHEET_RANGE ?? "A:G";

  if (!clientEmail || !privateKeyRaw) {
    return false;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: normalizePrivateKey(privateKeyRaw),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: sheetRange,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[record.submittedAt, record.name, record.phone, record.guests, record.date, record.time, record.source]]
    }
  });

  return true;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!isAdminSession(session)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await readReservations();
    return NextResponse.json({ ok: true, count: rows.length, data: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read reservations";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json({ ok: false, error: "Invalid request payload" }, { status: 400 });
    }

    const record: ReservationRecord = {
      id: randomUUID(),
      name: body.name.trim(),
      phone: body.phone.trim(),
      guests: body.guests,
      date: body.date.trim(),
      time: body.time.trim(),
      source: "Website",
      submittedAt: new Date().toISOString()
    };

    const existing = await readReservations();
    existing.push(record);
    await writeReservations(existing);

    let sheetSaved = false;
    try {
      sheetSaved = await appendToGoogleSheet(record);
    } catch (sheetError) {
      console.error("Google Sheet append failed", sheetError);
    }

    return NextResponse.json({
      ok: true,
      localSaved: true,
      sheetSaved,
      id: record.id
    });
  } catch (error) {
    console.error("Error saving reservation", error);
    const message = error instanceof Error ? error.message : "Failed to save reservation";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
