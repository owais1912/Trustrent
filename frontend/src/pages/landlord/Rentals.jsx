import { useEffect, useState } from "react";
import rentalService from "../../services/rentalService";

export default function LandlordRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRentals() {
    try {
      setLoading(true);
      setError("");

      const data = await rentalService.getLandlordRentals();

      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load rentals."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRentals();
  }, []);

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatRent = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Rentals
          </h1>

          <p className="mt-2 text-slate-500">
            View your current and previous rental agreements.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              Loading rentals...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-red-700">
              {error}
            </p>

            <button
              onClick={loadRentals}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && rentals.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No rentals yet
            </h2>

            <p className="mt-2 text-slate-500">
              Accepted rental applications will appear here.
            </p>
          </div>
        )}

        {!loading && !error && rentals.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {rental.property?.title ||
                        "Rental Property"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {rental.property?.city ||
                        rental.property?.location ||
                        "Location unavailable"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {rental.status || "UNKNOWN"}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-slate-500">
                      Tenant
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {rental.tenant?.name ||
                        rental.tenant?.email ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Monthly Rent
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {formatRent(rental.monthlyRent)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Start Date
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {formatDate(rental.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      End Date
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {formatDate(rental.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}