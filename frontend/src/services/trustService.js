import api from "./api";

export async function getTrustProfile() {
  const response = await api.get("/trust/profile");
  return response.data;
}