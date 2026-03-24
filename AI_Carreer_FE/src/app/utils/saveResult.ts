const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function saveResult(username: string, testType: string, result: unknown) {
  const response = await fetch(`${API_BASE}/results/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, test_type: testType, result }),
  });
  if (!response.ok) {
    throw new Error("save_failed");
  }
  return response.json();
}
