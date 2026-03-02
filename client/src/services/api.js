import axios from "axios";

const ensureApiVersionPath = (baseUrl) => {
  const normalized = String(baseUrl || "").trim().replace(/\/+$/, "");
  if (!normalized) return normalized;

  // If API path is already present, keep as-is.
  if (/\/api(\/v\d+)?$/i.test(normalized)) return normalized;

  // If only /api is provided, assume v1 routes.
  if (/\/api$/i.test(normalized)) return `${normalized}/v1`;

  // If a plain host/root URL is provided, append expected API prefix.
  return `${normalized}/api/v1`;
};

const rawApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = ensureApiVersionPath(rawApiBase) || "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const unwrap = async (request) => {
  const response = await request;
  return response.data;
};
