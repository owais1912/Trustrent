import { useEffect, useState } from "react";
import applicationService from "../../services/applicationService";

export default function LandlordApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await applicationService.getLandlordApplications();

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const acceptApplication = async (id) => {
    try {
      setProcessing(id);
      setError("");
      setMessage("");

      await applicationService.acceptApplication(id);

      setMessage(
        "Application accepted. Rental created successfully."
      );

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to accept application."
      );
    } finally {
      setProcessing(null);
    }
  };

  const rejectApplication = async (id) => {
    try {
      setProcessing(id);
      setError("");
      setMessage("");

      await applicationService.rejectApplication(id);

      setMessage("Application rejected.");

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reject application."
      );
    } finally {
      setProcessing(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Rental Applications
        </h1>

        <p className="mt-2 text-slate-500">
          Review applications for your properties.
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
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No applications
          </h2>

          <p className="mt-2 text-slate-500">
            Applications for your properties will appear
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row">
                <div>
                  <h2 className="text-xl font-bold">
                    {application.property?.title ||
                      "Property"}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    Applicant:{" "}
                    {application.tenant?.name ||
                      application.tenantName ||
                      application.tenant?.email ||
                      "Tenant"}
                  </p>

                  {application.tenant?.email && (
                    <p className="mt-1 text-sm text-slate-500">
                      {application.tenant.email}
                    </p>
                  )}

                  {application.message && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-4">
                      <p className="text-sm font-medium">
                        Message
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {application.message}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">
                    {application.status}
                  </span>
                </div>
              </div>

              {application.status === "PENDING" && (
                <div className="mt-6 flex gap-3 border-t pt-5">
                  <button
                    type="button"
                    disabled={
                      processing === application.id
                    }
                    onClick={() =>
                      acceptApplication(
                        application.id
                      )
                    }
                    className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                  >
                    {processing === application.id
                      ? "Processing..."
                      : "Accept"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      processing === application.id
                    }
                    onClick={() =>
                      rejectApplication(
                        application.id
                      )
                    }
                    className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}