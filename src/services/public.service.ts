import axios from "axios";
import { mockAdapter } from "../mock/adapter";
import { API_BASE_URL, unwrapResponseData } from "./axios/axiosInstance";

const publicClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  adapter: mockAdapter,
});

publicClient.interceptors.response.use(unwrapResponseData);

export const publicService = {
  getCard: (identifier: string, source?: string) =>
    publicClient.get(
      `/cards/${encodeURIComponent(identifier.trim().toLowerCase())}`,
      {
        params: source ? { source } : undefined,
      },
    ),
};
