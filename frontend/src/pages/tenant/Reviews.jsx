import { useEffect, useState } from "react";
import rentalService from "../../services/rentalService";
import reviewService from "../../services/reviewService";

const initialForm = {
  rentalId: "",
  maintenanceRating: 5,
  responsivenessRating: 5,
  communicationRating: 5,
  propertyCareRating: 5,
  ruleComplianceRating: 5,
  overallRating: 5,
  comment: "",
};

export default function Reviews() {
  const [rentals, setRentals] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [receivedReviews, setReceivedReviews] =
    useState([]);

  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        rentalData,
        myReviewData,
        receivedData,
      ] = await Promise.all([
        rentalService.getMyRentals(),
        reviewService.getMyReviews(),
        reviewService.getReceivedReviews(),
      ]);

      setRentals(
        Array.isArray(rentalData)
          ? rentalData
          : []
      );

      setMyReviews(
        Array.isArray(myReviewData)
          ? myReviewData
          : []
      );

      setReceivedReviews(
        Array.isArray(receivedData)
          ? receivedData
          : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  const openReviewForm = (rental) => {
    setForm({
      ...initialForm,
      rentalId: rental.id,
    });

    setShowForm(true);
    setError("");
    setMessage("");
  };

  const closeReviewForm = () => {
    setShowForm(false);
    setForm(initialForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name.includes("Rating")
        ? Number(value)
        : value,
    }));
  };

  const submitReview = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await reviewService.createReview({
        rentalId: form.rentalId,
        maintenanceRating:
          Number(form.maintenanceRating),
        responsivenessRating:
          Number(form.responsivenessRating),
        communicationRating:
          Number(form.communicationRating),
        propertyCareRating:
          Number(form.propertyCareRating),
        ruleComplianceRating:
          Number(form.ruleComplianceRating),
        overallRating:
          Number(form.overallRating),
        comment: form.comment,
      });

      setMessage(
        "Review submitted successfully."
      );

      closeReviewForm();

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setSaving(false);
    }
  };

  const hasReviewedRental = (rentalId) => {
    return myReviews.some(
      (review) => review.rentalId === rentalId
    );
  };

  const RatingSelect = ({
    name,
    label,
    value,
  }) => (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="input"
      >
        <option value={5}>5 - Excellent</option>
        <option value={4}>4 - Good</option>
        <option value={3}>3 - Average</option>
        <option value={2}>2 - Poor</option>
        <option value={1}>1 - Very Poor</option>
      </select>
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Reviews & Reputation
        </h1>

        <p className="mt-2 text-slate-500">
          Review landlords and see reviews you've
          received.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-8">
          Loading reviews...
        </div>
      ) : (
        <>
          {/* RENTALS AVAILABLE FOR REVIEW */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold">
                Your Rentals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Leave a review for your rental
                experience.
              </p>
            </div>

            {rentals.length === 0 ? (
              <div className="rounded-xl border bg-white p-6 text-slate-500">
                You don't have any rentals yet.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {rentals.map((rental) => {
                  const alreadyReviewed =
                    hasReviewedRental(rental.id);

                  return (
                    <article
                      key={rental.id}
                      className="rounded-2xl border bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold">
                            {rental.property?.title ||
                              "Rental Property"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {rental.property?.city ||
                              ""}
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                          {rental.status}
                        </span>
                      </div>

                      {alreadyReviewed ? (
                        <div className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                          You have already reviewed this
                          rental.
                        </div>
                      ) : rental.status ===
                        "CANCELLED" ? (
                        <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                          This rental cannot be reviewed.
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            openReviewForm(rental)
                          }
                          className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                        >
                          Write Review
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* MY REVIEWS */}
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              Reviews You Submitted
            </h2>

            {myReviews.length === 0 ? (
              <div className="mt-4 rounded-xl border bg-white p-6 text-slate-500">
                You haven't submitted any reviews yet.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {myReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border bg-white p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {review.reviewedUser?.name ||
                            review.reviewedUserName ||
                            "User"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                        {review.overallRating}/5
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-4 text-slate-600">
                        {review.comment}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* RECEIVED REVIEWS */}
          <section className="mt-12">
            <h2 className="text-xl font-bold">
              Reviews You Received
            </h2>

            {receivedReviews.length === 0 ? (
              <div className="mt-4 rounded-xl border bg-white p-6 text-slate-500">
                No reviews received yet.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {receivedReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border bg-white p-5"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-semibold">
                          {review.reviewer?.name ||
                            review.reviewerName ||
                            "User"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                        {review.overallRating}/5
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-4 text-slate-600">
                        {review.comment}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* REVIEW MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Write a Review
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Rate your rental experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewForm}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={submitReview}
              className="mt-6 space-y-5"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <RatingSelect
                  name="maintenanceRating"
                  label="Maintenance"
                  value={form.maintenanceRating}
                />

                <RatingSelect
                  name="responsivenessRating"
                  label="Responsiveness"
                  value={form.responsivenessRating}
                />

                <RatingSelect
                  name="communicationRating"
                  label="Communication"
                  value={form.communicationRating}
                />

                <RatingSelect
                  name="propertyCareRating"
                  label="Property Care"
                  value={form.propertyCareRating}
                />

                <RatingSelect
                  name="ruleComplianceRating"
                  label="Rule Compliance"
                  value={form.ruleComplianceRating}
                />

                <RatingSelect
                  name="overallRating"
                  label="Overall Rating"
                  value={form.overallRating}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Comment
                </label>

                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows="5"
                  maxLength={1000}
                  className="input"
                  placeholder="Share your rental experience..."
                />

                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.comment.length}/1000
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

                <button
                  type="button"
                  onClick={closeReviewForm}
                  className="rounded-lg border px-5 py-3 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}