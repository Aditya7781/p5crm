export type Role = "admin" | "staff" | "user";

export type LoginResponse = {
  token: string;
  user: { id: string; name: string; email: string; role: Role };
};

const API_URL = import.meta.env.VITE_API_URL ?? "https://your-api.example.com";

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? "Login failed");
  return res.json();
}

export async function meRequest(token: string): Promise<LoginResponse["user"]> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}
