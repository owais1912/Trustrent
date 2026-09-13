import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties } from "../../services/propertyService";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProperties(filters = {}) {
    setLoading(true);
    setError("");

    try {
      const data = await getProperties(filters);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    const filters = {};

    if (city.trim()) filters.city = city.trim();
    if (maxRent) filters.maxRent = maxRent;

    loadProperties(filters);
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-4xl font-bold">Find your next home</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Discover rental properties from verified landlords.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-8 grid gap-4 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-3"
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="number"
            value={maxRent}
            onChange={(e) => setMaxRent(e.target.value)}
            placeholder="Maximum monthly rent"
            className="rounded-lg border px-4 py-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-10 text-[var(--text-secondary)]">
            Loading properties...
          </p>
        ) : properties.length === 0 ? (
          <div className="mt-10 rounded-2xl border p-10 text-center">
            <h2 className="text-xl font-semibold">
              No properties found
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">
              Try changing your search filters.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function PropertyCard({ property }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
        Property Image
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">
            {property.title}
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
            {property.status}
          </span>
        </div>

        <p className="mt-2 text-[var(--text-secondary)]">
          {property.city}
        </p>

        <p className="mt-4 text-2xl font-bold">
          ₹{Number(property.monthlyRent || 0).toLocaleString("en-IN")}
          <span className="text-sm font-normal text-gray-500">
            {" "}
            / month
          </span>
        </p>

        <div className="mt-3 text-sm text-gray-600">
          {property.bedrooms ?? "-"} bedrooms ·{" "}
          {property.bathrooms ?? "-"} bathrooms
        </div>

        <Link
          to={`/properties/${property.id}`}
          className="mt-5 block rounded-lg bg-black px-4 py-3 text-center font-semibold text-white"
        >
          View Property
        </Link>
      </div>
    </div>
  );
}