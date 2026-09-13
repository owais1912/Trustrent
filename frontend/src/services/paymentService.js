import api from "./api";

const paymentService = {
  recordPayment: async (data) => {
    const response = await api.post(
      "/payments",
      data
    );

    return response.data;
  },

  getRentalPayments: async (rentalId) => {
    const response = await api.get(
      `/payments/rental/${rentalId}`
    );

    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get("/payments/my");
    return response.data;
  },
};

export default paymentService;