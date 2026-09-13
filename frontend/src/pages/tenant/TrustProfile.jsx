import { useEffect, useState } from "react";
import { getTrustProfile } from "../../services/trustService";
import TrustScoreCard from "../../components/trust/TrustScoreCard";

export default function TrustProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getTrustProfile();
        setProfile(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load trust profile."
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
        <h1 className="text-4xl font-bold">My Trust Profile</h1>

        <p className="mt-2 text-[var(--text-secondary)]">
          Your rental reputation across TrustRent.
        </p>

        {loading && (
          <p className="mt-8">Loading trust profile...</p>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {profile && (
          <div className="mt-8">
            <TrustScoreCard profile={profile} />

            <section className="mt-8 rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Recent Trust Events
              </h2>

              {!profile.recentEvents?.length ? (
                <p className="mt-4 text-gray-500">
                  No recent trust events.
                </p>
              ) : (
                <div className="mt-4 divide-y">
                  {profile.recentEvents.map((event, index) => (
                    <div
                      key={event.id || index}
                      className="flex items-center justify-between py-4"
                    >
                      <div>
                        <p className="font-medium">
                          {event.eventType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {event.description}
                        </p>
                      </div>

                      <span className="font-bold">
                        {event.scoreChange > 0 ? "+" : ""}
                        {event.scoreChange}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}