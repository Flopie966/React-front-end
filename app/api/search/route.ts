import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint: stuurt uploads door naar de externe MoneyBear API
export async function POST(req: NextRequest) {
  // Haal de multipart formdata uit de inkomende request
  const formData = await req.formData();

  // Stuur de formdata door naar de externe API
  const apiRes = await fetch("https://api.moneybear.nl/search", {
    method: "POST",
    body: formData,
    // Geen extra headers: fetch voegt zelf de juiste Content-Type toe
  });

  // Haal de JSON response op
  const data = await apiRes.json();

  // Geef de response terug aan de frontend
  return NextResponse.json(data, { status: apiRes.status });
}
