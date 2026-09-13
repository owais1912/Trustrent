import api from "./api";

export async function getProperties(params = {}) {
  const response = await api.get("/properties", { params });
  return response.data;
}

export async function getProperty(id) {
  const response = await api.get(`/properties/${id}`);
  return response.data;
}

export async function createProperty(data) {
  const response = await api.post("/properties", data);
  return response.data;
}

export async function updateProperty(id, data) {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
}

export async function deleteProperty(id) {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
}

export async function getPropertyImages(propertyId) {
  const response = await api.get(
    `/properties/${propertyId}/images`
  );
  return response.data;
}

export async function addPropertyImage(
  propertyId,
  imageUrl,
  displayOrder = 0
) {
  const response = await api.post(
    `/properties/${propertyId}/images`,
    {
      imageUrl,
      displayOrder,
    }
  );

  return response.data;
}

export async function deletePropertyImage(imageId) {
  const response = await api.delete(
    `/properties/images/${imageId}`
  );

  return response.data;
}

const propertyService = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyImages,
  addPropertyImage,
  deletePropertyImage,
};

export default propertyService;