export default {
  async fetch(req, env) {
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type"
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const params = new URL(req.url).searchParams;
    const latStr = params.get("lat");
    const lonStr = params.get("lon");
    const lat = Number(latStr);
    const lon = Number(lonStr);

    if (
      latStr === null || lonStr === null ||
      !Number.isFinite(lat) || !Number.isFinite(lon) ||
      Math.abs(lat) > 90 || Math.abs(lon) > 180
    ) {
      return new Response(JSON.stringify({ error: "Parâmetros lat e lon inválidos." }), {
        status: 400,
        headers: { ...cors, "content-type": "application/json" }
      });
    }

    const url =
      "https://api.openweathermap.org/data/2.5/weather" +
      `?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${env.OWM_KEY}`;

    const r = await fetch(url, { cf: { cacheTtl: 600, cacheEverything: true } });

    return new Response(r.body, {
      status: r.status,
      headers: { ...cors, "content-type": "application/json" }
    });
  }
};