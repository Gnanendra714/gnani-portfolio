export const API_BASE_URL =
  "https://gnani-portfolio-server.onrender.com/api";

export function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`;
}
