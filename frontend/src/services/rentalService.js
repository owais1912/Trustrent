import api from "./api";

export async function getMyRentals() {
  const response = await api.get("/rentals/my");
  return response.data;
}

export async function getLandlordRentals() {
  const response = await api.get("/rentals/landlord");
  return response.data;
}

const rentalService = {
  getMyRentals,
  getLandlordRentals,
};

export default rentalService;