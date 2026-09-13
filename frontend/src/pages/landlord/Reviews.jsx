import { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";

export default function LandlordReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data = await reviewService.getReceivedReviews();

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function Rating({ value }) {
    const rating = Number(value || 0);

    return (
      <span className="font-semibold">
        {rating}/5
      </span>
    );
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Reviews
          </h1>

          <p className="mt-2 text-slate-500">
            Reviews received from your tenants.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              Loading reviews...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-red-700">{error}</p>

            <button
              onClick={loadReviews}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No reviews yet
            </h2>

            <p className="mt-2 text-slate-500">
              Reviews from tenants will appear here.
            </p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {review.reviewer?.name ||
                        review.reviewer?.email ||
                        "Tenant"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-2">
                    <span className="text-sm text-slate-500">
                      Overall:{" "}
                    </span>

                    <Rating
                      value={review.overallRating}
                    />
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-5 text-slate-700">
                    {review.comment}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs text-slate-500">
                      Maintenance
                    </p>
                    <p className="mt-1">
                      <Rating
                        value={review.maintenanceRating}
                      />
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Responsiveness
                    </p>
                    <p className="mt-1">
                      <Rating
                        value={review.responsivenessRating}
                      />
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Communication
                    </p>
                    <p className="mt-1">
                      <Rating
                        value={review.communicationRating}
                      />
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Property Care
                    </p>
                    <p className="mt-1">
                      <Rating
                        value={review.propertyCareRating}
                      />
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Rule Compliance
                    </p>
                    <p className="mt-1">
                      <Rating
                        value={review.ruleComplianceRating}
                      />
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}