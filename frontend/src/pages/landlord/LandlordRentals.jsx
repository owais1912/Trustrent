import { useEffect, useState } from "react";
import rentalService from "../../services/rentalService";

export default function LandlordRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getLandlordRentals();
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        My Rentals
      </h1>

      <p className="mt-2 text-slate-500">
        Manage your active and previous rental agreements.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-xl border bg-white p-8">
          Loading rentals...
        </div>
      ) : rentals.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No rentals yet
          </h2>

          <p className="mt-2 text-slate-500">
            Accepted rental applications will create
            rentals here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {rentals.map((rental) => (
            <article
              key={rental.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {rental.property?.title ||
                      "Rental Property"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {rental.property?.city || ""}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {rental.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Tenant
                  </p>
                  <p className="mt-1 font-semibold">
                    {rental.tenant?.name ||
                      rental.tenantName ||
                      rental.tenant?.email ||
                      "Tenant"}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Monthly Rent
                  </p>
                  <p className="mt-1 font-semibold">
                    ₹
                    {Number(
                      rental.monthlyRent || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Start Date
                  </p>
                  <p className="mt-1 font-semibold">
                    {rental.startDate || "-"}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    End Date
                  </p>
                  <p className="mt-1 font-semibold">
                    {rental.endDate || "Active"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}