import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          My Applications
        </h1>

        <p className="mt-2 text-gray-500">
          Track the properties you have applied for.
        </p>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="mt-8 rounded-2xl border p-10 text-center">
            <h2 className="text-xl font-semibold">
              No applications yet
            </h2>

            <Link
              to="/properties"
              className="mt-4 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-bold">
                      {application.property?.title ||
                        "Property"}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      {application.property?.city || ""}
                    </p>
                  </div>

                  <Status status={application.status} />
                </div>

                {application.message && (
                  <p className="mt-4 text-gray-600">
                    {application.message}
                  </p>
                )}

                <p className="mt-4 text-sm text-gray-500">
                  Applied:{" "}
                  {application.appliedAt
                    ? new Date(
                        application.appliedAt
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Status({ status }) {
  return (
    <span className="h-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
      {status}
    </span>
  );
}