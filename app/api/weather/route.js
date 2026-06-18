import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Nakuru, Kenya";
  const KEY  = process.env.OPENWEATHER_KEY;
  const BASE = "https://api.openweathermap.org/data/2.5";

  try {
    const [curRes, foreRes] = await Promise.all([
      fetch(BASE + "/weather?q=" + encodeURIComponent(city) + "&appid=" + KEY + "&units=metric"),
      fetch(BASE + "/forecast?q=" + encodeURIComponent(city) + "&appid=" + KEY + "&units=metric&cnt=40"),
    ]);

    const current  = await curRes.json();
    const forecast = await foreRes.json();

    if (current.cod !== 200) {
      return Response.json({ error: current.message }, { status: 400 });
    }

    // ── Kenya season detector ──────────────────────────────
    const month = new Date().getMonth() + 1;
    const season =
      month >= 3 && month <= 5  ? "long_rains"  :
      month >= 10 && month <= 12 ? "short_rains" :
      month >= 6 && month <= 9  ? "cool_dry"    : "hot_dry";

    const hourOfDay = new Date().getUTCHours() + 3;

    // ── Write to Supabase weather_readings ─────────────────
    const { error: dbError } = await supabase
      .from("weather_readings")
      .insert({
        source_id:      "weather",
        county:         "Nakuru",
        lat:            current.coord.lat,
        lon:            current.coord.lon,
        temperature_c:  Math.round(current.main.temp * 10) / 10,
        humidity_pct:   current.main.humidity,
        rainfall_mm:    current.rain?.["1h"] || 0,
        wind_speed_kmh: Math.round(current.wind.speed * 3.6 * 10) / 10,
        wind_direction: current.wind.deg?.toString(),
        pressure_hpa:   current.main.pressure,
        description:    current.weather[0].description,
        recorded_at:    new Date().toISOString(),
        utc_offset:     3,
        hour_of_day:    hourOfDay > 23 ? hourOfDay - 24 : hourOfDay,
        season,
      });

    if (dbError) {
      console.error("Supabase write error:", dbError.message);
    } else {
      console.log("Weather reading saved to Supabase for", city);
    }

    return Response.json({ current, forecast });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}