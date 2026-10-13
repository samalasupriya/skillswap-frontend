const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    const text = await res.text();
    try { 
      data = text ? JSON.parse(text) : null; 
    } catch { 
      data = text; 
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: err.message };
  }
}