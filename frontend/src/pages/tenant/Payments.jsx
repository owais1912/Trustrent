import { useEffect, useState } from "react";
import rentalService from "../../services/rentalService";
import paymentService from "../../services/paymentService";

export default function Payments() {
  const [rentals, setRentals] = useState([]);
  const [payments, setPayments] = useState({});
  const [selectedRental, setSelectedRental] = useState(null);

  const [form, setForm] = useState({
    paymentMonth: "",
    paidDate: "",
    transactionReference: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await rentalService.getMyRentals();
      const list = Array.isArray(data) ? data : [];

      setRentals(list);

      await Promise.all(
        list.map((rental) => loadPayments(rental.id))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async (rentalId) => {
    try {
      const data = await paymentService.getRentalPayments(
        rentalId
      );

      setPayments((previous) => ({
        ...previous,
        [rentalId]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error("Unable to load payments", err);
    }
  };

  const openPaymentForm = (rental) => {
    const today = new Date();

    const month = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    const date = today.toISOString().split("T")[0];

    setSelectedRental(rental);

    setForm({
      paymentMonth: month,
      paidDate: date,
      transactionReference: "",
      notes: "",
    });

    setError("");
    setMessage("");
  };

  const closePaymentForm = () => {
    if (saving) return;

    setSelectedRental(null);

    setForm({
      paymentMonth: "",
      paidDate: "",
      transactionReference: "",
      notes: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submitPayment = async (event) => {
    event.preventDefault();

    if (!selectedRental) {
      return;
    }

    const rentalId = selectedRental.id;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.paymentMonth) {
        setError("Please select a payment month.");
        return;
      }

      if (!form.paidDate) {
        setError("Please select the paid date.");
        return;
      }

      const paymentMonth = `${form.paymentMonth}-01`;

      await paymentService.recordPayment({
        rentalId,
        paymentMonth,
        paidDate: form.paidDate,
        transactionReference:
          form.transactionReference.trim() || null,
        notes: form.notes.trim() || null,
      });

      setMessage("Payment recorded successfully.");

      setSelectedRental(null);

      setForm({
        paymentMonth: "",
        paidDate: "",
        transactionReference: "",
        notes: "",
      });

      await loadPayments(rentalId);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to record payment."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "EARLY":
        return "bg-green-100 text-green-700";

      case "ON_TIME":
        return "bg-blue-100 text-blue-700";

      case "LATE":
        return "bg-orange-100 text-orange-700";

      case "MISSED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Rent & Payments
        </h1>

        <p className="mt-2 text-slate-500">
          Track your monthly rent payments and payment
          behavior.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-slate-500">
            Loading payments...
          </p>
        </div>
      ) : rentals.length === 0 ? (
        /* NO RENTALS */
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No rentals
          </h2>

          <p className="mt-2 text-slate-500">
            Your rent payment history will appear here
            after you have a rental.
          </p>
        </div>
      ) : (
        /* RENTALS */
        <div className="space-y-8">
          {rentals.map((rental) => {
            const rentalPayments =
              payments[rental.id] || [];

            return (
              <section
                key={rental.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                {/* RENTAL HEADER */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">
                        {rental.property?.title ||
                          "Rental Property"}
                      </h2>

                      {rental.status && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            rental.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : rental.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rental.status}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {rental.property?.city || ""}
                    </p>

                    {rental.property?.address && (
                      <p className="mt-1 text-sm text-slate-500">
                        {rental.property.address}
                      </p>
                    )}

                    <p className="mt-3 font-semibold">
                      ₹{formatAmount(rental.monthlyRent)} / month
                    </p>

                    {rental.startDate && (
                      <p className="mt-1 text-xs text-slate-500">
                        Started: {formatDate(rental.startDate)}
                      </p>
                    )}
                  </div>

                  {rental.status === "ACTIVE" && (
                    <button
                      type="button"
                      onClick={() =>
                        openPaymentForm(rental)
                      }
                      className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      Record Payment
                    </button>
                  )}
                </div>

                {/* PAYMENT HISTORY */}
                {rentalPayments.length === 0 ? (
                  <div className="mt-6 rounded-lg bg-slate-50 p-5 text-center text-slate-500">
                    No payment records for this rental.
                  </div>
                ) : (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="px-3 py-3">
                            Month
                          </th>

                          <th className="px-3 py-3">
                            Due
                          </th>

                          <th className="px-3 py-3">
                            Paid
                          </th>

                          <th className="px-3 py-3">
                            Amount
                          </th>

                          <th className="px-3 py-3">
                            Status
                          </th>

                          <th className="px-3 py-3">
                            Reference
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {rentalPayments.map((payment) => (
                          <tr
                            key={payment.id}
                            className="border-b last:border-0"
                          >
                            <td className="px-3 py-3">
                              {formatDate(
                                payment.paymentMonth
                              )}
                            </td>

                            <td className="px-3 py-3">
                              {formatDate(payment.dueDate)}
                            </td>

                            <td className="px-3 py-3">
                              {formatDate(payment.paidDate)}
                            </td>

                            <td className="px-3 py-3 font-medium">
                              ₹{formatAmount(payment.amount)}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                  payment.status
                                )}`}
                              >
                                {payment.status || "UNKNOWN"}
                              </span>
                            </td>

                            <td className="max-w-[180px] truncate px-3 py-3 text-slate-500">
                              {payment.transactionReference ||
                                "-"}
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

      {/* PAYMENT MODAL */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Record Rent Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedRental.property?.title ||
                    "Rental"}
                </p>
              </div>

              <button
                type="button"
                onClick={closePaymentForm}
                disabled={saving}
                className="text-2xl text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            {/* RENTAL INFORMATION */}
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">
                  Monthly Rent
                </span>

                <span className="font-semibold">
                  ₹
                  {formatAmount(
                    selectedRental.monthlyRent
                  )}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-slate-500">
                  Due Date
                </span>

                <span className="font-semibold">
                  5th of the month
                </span>
              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={submitPayment}
              className="mt-6 space-y-5"
            >
              {/* PAYMENT MONTH */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Payment Month
                </label>

                <input
                  type="month"
                  name="paymentMonth"
                  value={form.paymentMonth}
                  onChange={handleChange}
                  required
                  className="input"
                />

                <p className="mt-1 text-xs text-slate-500">
                  The system will calculate the due date
                  automatically.
                </p>
              </div>

              {/* PAID DATE */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Paid Date
                </label>

                <input
                  type="date"
                  name="paidDate"
                  value={form.paidDate}
                  onChange={handleChange}
                  required
                  max={new Date()
                    .toISOString()
                    .split("T")[0]}
                  className="input"
                />
              </div>

              {/* AMOUNT */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amount
                </label>

                <input
                  value={`₹${formatAmount(
                    selectedRental.monthlyRent
                  )}`}
                  disabled
                  readOnly
                  className="input bg-slate-50"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Amount is taken directly from your rental
                  agreement.
                </p>
              </div>

              {/* TRANSACTION REFERENCE */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Transaction Reference
                </label>

                <input
                  name="transactionReference"
                  value={form.transactionReference}
                  onChange={handleChange}
                  className="input"
                  placeholder="Optional"
                  maxLength={100}
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                  placeholder="Optional notes"
                  maxLength={500}
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Recording..."
                    : "Record Payment"}
                </button>

                <button
                  type="button"
                  onClick={closePaymentForm}
                  disabled={saving}
                  className="rounded-lg border px-5 py-3 font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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