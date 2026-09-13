import api from "./api";

export async function createApplication(data) {
  const response = await api.post("/applications", data);
  return response.data;
}

export async function getMyApplications() {
  const response = await api.get("/applications/my");
  return response.data;
}

export async function getLandlordApplications() {
  const response = await api.get("/applications/landlord");
  return response.data;
}

export async function acceptApplication(id) {
  const response = await api.post(
    `/applications/${id}/accept`
  );
  return response.data;
}

export async function rejectApplication(id) {
  const response = await api.post(
    `/applications/${id}/reject`
  );
  return response.data;
}

const applicationService = {
  createApplication,
  getMyApplications,
  getLandlordApplications,
  acceptApplication,
  rejectApplication,
};

export default applicationService;