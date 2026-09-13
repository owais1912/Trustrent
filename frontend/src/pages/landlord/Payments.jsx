import { useEffect, useState } from "react";
import rentalService from "../../services/rentalService";
import paymentService from "../../services/paymentService";

export default function LandlordPayments() {
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const rentalData = await rentalService.getLandlordRentals();
      const rentalList = Array.isArray(rentalData) ? rentalData : [];

      setRentals(rentalList);

      const paymentResults = await Promise.all(
        rentalList.map(async (rental) => {
          try {
            const data = await paymentService.getRentalPayments(
              rental.id
            );

            return {
              rentalId: rental.id,
              payments: Array.isArray(data) ? data : [],
            };
          } catch {
            return {
              rentalId: rental.id,
              payments: [],
            };
          }
        })
      );

      const paymentMap = {};

      paymentResults.forEach((item) => {
        paymentMap[item.rentalId] = item.payments;
      });

      setPayments(paymentMap);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load payment information."
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

  function formatAmount(value) {
    if (value === null || value === undefined) {
      return "—";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  }

  function statusClass(status) {
    if (status === "EARLY") {
      return "bg-green-100 text-green-700";
    }

    if (status === "ON_TIME") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "LATE") {
      return "bg-orange-100 text-orange-700";
    }

    if (status === "MISSED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Rental Payments
          </h1>

          <p className="mt-2 text-slate-500">
            View payment history for your rental properties.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              Loading payments...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-red-700">{error}</p>

            <button
              onClick={loadPayments}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && rentals.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">
              No rental payments yet
            </h2>

            <p className="mt-2 text-slate-500">
              Payments will appear here once you have active
              rentals.
            </p>
          </div>
        )}

        {!loading && !error && rentals.length > 0 && (
          <div className="space-y-6">
            {rentals.map((rental) => {
              const rentalPayments =
                payments[rental.id] || [];

              return (
                <section
                  key={rental.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {rental.property?.title ||
                          "Rental Property"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Tenant:{" "}
                        {rental.tenant?.name ||
                          rental.tenant?.email ||
                          "—"}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-500">
                        Monthly Rent
                      </p>

                      <p className="text-lg font-bold">
                        {formatAmount(rental.monthlyRent)}
                      </p>
                    </div>
                  </div>

                  {rentalPayments.length === 0 ? (
                    <div className="mt-6 rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                      No payment records for this rental.
                    </div>
                  ) : (
                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full min-w-[650px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                            <th className="px-3 py-3">
                              Month
                            </th>
                            <th className="px-3 py-3">
                              Due Date
                            </th>
                            <th className="px-3 py-3">
                              Paid Date
                            </th>
                            <th className="px-3 py-3">
                              Amount
                            </th>
                            <th className="px-3 py-3">
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {rentalPayments.map((payment) => (
                            <tr
                              key={payment.id}
                              className="border-b border-slate-100"
                            >
                              <td className="px-3 py-4">
                                {formatDate(
                                  payment.paymentMonth
                                )}
                              </td>

                              <td className="px-3 py-4">
                                {formatDate(payment.dueDate)}
                              </td>

                              <td className="px-3 py-4">
                                {formatDate(payment.paidDate)}
                              </td>

                              <td className="px-3 py-4 font-medium">
                                {formatAmount(payment.amount)}
                              </td>

                              <td className="px-3 py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                                    payment.status
                                  )}`}
                                >
                                  {payment.status ||
                                    "UNKNOWN"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}