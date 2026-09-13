import api from "./api";

const reviewService = {
  createReview: async (data) => {
    const response = await api.post(
      "/reviews",
      data
    );

    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get("/reviews/my");
    return response.data;
  },

  getReceivedReviews: async () => {
    const response = await api.get(
      "/reviews/received"
    );

    return response.data;
  },

  getRentalReviews: async (rentalId) => {
    const response = await api.get(
      `/reviews/rental/${rentalId}`
    );

    return response.data;
  },
};

export default reviewService;