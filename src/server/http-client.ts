import axios from "axios";

const BASE_URL = process.env.CROSSMINT_CHALLENGE_URL!;
let candidateId: string | null = null;
export const setCandidateId = (id: string) => (candidateId = id);
export const clearCandidateId = () => (candidateId = null);
export const getCandidateId = () => candidateId;

// custom axios instance
export const crossmintHttpClient = axios.create({
  baseURL : BASE_URL,
  timeout : 10_000,
  headers : { "Content-Type": "application/json" },
});

// request interceptor to add candidateId to POST and DELETE requests
crossmintHttpClient.interceptors.request.use(cfg => {
  if (candidateId && ["post","delete"].includes((cfg.method ?? "").toLowerCase()))
    cfg.data = { ...(cfg.data ?? {}), candidateId };
  return cfg;
});
