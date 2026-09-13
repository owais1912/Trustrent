import { useEffect, useState } from "react";
import { getMyRentals } from "../../services/rentalService";

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyRentals();
        setRentals(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load rentals."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold">My Rentals</h1>

        <p className="mt-2 text-gray-500">
          Your current and previous rental agreements.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8">Loading rentals...</p>
        ) : rentals.length === 0 ? (
          <div className="mt-8 rounded-2xl border p-10 text-center">
            <h2 className="text-xl font-semibold">
              No rentals yet
            </h2>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {rentals.map((rental) => (
              <RentalCard
                key={rental.id}
                rental={rental}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function RentalCard({ rental }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            {rental.property?.title || "Rental Property"}
          </h2>

          <p className="mt-1 text-gray-500">
            {rental.property?.city || ""}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
          {rental.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Info
          label="Monthly Rent"
          value={`₹${Number(
            rental.monthlyRent || 0
          ).toLocaleString("en-IN")}`}
        />

        <Info
          label="Start Date"
          value={rental.startDate || "-"}
        />

        <Info
          label="End Date"
          value={rental.endDate || "Ongoing"}
        />

        <Info
          label="Landlord"
          value={
            rental.landlord?.name ||
            rental.landlord?.email ||
            "-"
          }
        />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}