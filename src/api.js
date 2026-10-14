const BASE = import.meta.env.VITE_API_URL || "https://skillswap-backend-ygjo.onrender.com/api";

export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try { 
    data = text ? JSON.parse(text) : null; 
  } catch { 
    data = text; 
  }

  if (!res.ok) {
    throw new Error(typeof data === 'string' ? data : data?.message || `Error ${res.status}`);
  }

  return data;
}