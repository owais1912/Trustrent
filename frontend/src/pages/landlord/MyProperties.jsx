import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import propertyService from "../../services/propertyService";
import PropertyImageManager from "../../components/property/PropertyImageManager";

const initialForm = {
  title: "",
  description: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  monthlyRent: "",
  securityDeposit: "",
  bedrooms: "",
  bathrooms: "",
  propertyType: "APARTMENT",
};

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [images, setImages] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      setError("");

      const data = await propertyService.getProperties();

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("LOAD PROPERTIES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadImages(propertyId) {
    try {
      const data =
        await propertyService.getPropertyImages(propertyId);

      setImages((previous) => ({
        ...previous,
        [propertyId]: Array.isArray(data) ? data : [],
      }));
    } catch (err) {
      console.error(
        "Unable to load property images:",
        err
      );
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ ...initialForm });
    setError("");
    setMessage("");
    setShowForm(true);
  }

  function openEdit(property) {
    setEditingId(property.id);

    setForm({
      title: property.title || "",
      description: property.description || "",
      address: property.location || "",
      city: property.city || "",
      state: property.state || "",
      postalCode: property.postalCode || "",
      monthlyRent: property.monthlyRent ?? "",
      securityDeposit: property.securityDeposit ?? "",
      bedrooms: property.bedrooms ?? "",
      bathrooms: property.bathrooms ?? "",
      propertyType:
        property.propertyType || "APARTMENT",
    });

    setError("");
    setMessage("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Property title is required.");
      return;
    }

    if (!form.address.trim()) {
      setError("Address / location is required.");
      return;
    }

    if (!form.city.trim()) {
      setError("City is required.");
      return;
    }

    if (!form.monthlyRent || Number(form.monthlyRent) <= 0) {
      setError("Monthly rent must be greater than 0.");
      return;
    }

    if (
      !form.securityDeposit ||
      Number(form.securityDeposit) < 0
    ) {
      setError("Security deposit is required.");
      return;
    }

    if (
      form.bedrooms === "" ||
      Number(form.bedrooms) < 0
    ) {
      setError("Bedrooms must be 0 or greater.");
      return;
    }

    if (
      form.bathrooms === "" ||
      Number(form.bathrooms) < 0
    ) {
      setError("Bathrooms must be 0 or greater.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      /*
       * IMPORTANT:
       * The backend Property entity uses:
       *   location
       *   city
       *   monthlyRent
       *   securityDeposit
       *   bedrooms
       *   bathrooms
       *   propertyType
       *   status
       *
       * The UI uses "address", so map address -> location.
       */

      const payload = {
        title: form.title.trim(),
        description:
          form.description.trim() ||
          "Rental property",

        location: form.address.trim(),

        city: form.city.trim(),

        monthlyRent: Number(form.monthlyRent),

        securityDeposit: Number(
          form.securityDeposit
        ),

        bedrooms: Number(form.bedrooms),

        bathrooms: Number(form.bathrooms),

        propertyType: form.propertyType,

        /*
         * New properties must be available.
         * During editing, preserve the existing status.
         */
        status: editingId
          ? properties.find(
              (property) => property.id === editingId
            )?.status || "AVAILABLE"
          : "AVAILABLE",
      };

      console.log(
        "PROPERTY PAYLOAD:",
        payload
      );

      if (editingId) {
        await propertyService.updateProperty(
          editingId,
          payload
        );

        setMessage(
          "Property updated successfully."
        );
      } else {
        await propertyService.createProperty(
          payload
        );

        setMessage(
          "Property created successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...initialForm });

      await loadProperties();
    } catch (err) {
      console.error(
        "SAVE PROPERTY ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err.response?.status
      );

      console.error(
        "RESPONSE:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to save property."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateProperty(propertyId) {
    const confirmed = window.confirm(
      "Deactivate this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await propertyService.deleteProperty(
        propertyId
      );

      setMessage(
        "Property deactivated successfully."
      );

      await loadProperties();
    } catch (err) {
      console.error(
        "DEACTIVATE PROPERTY ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to deactivate property."
      );
    }
  }

  async function refreshImages(propertyId) {
    await loadImages(propertyId);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            My Properties
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your rental properties and images.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Property
        </button>
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

      {showForm && (
        <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId
                ? "Edit Property"
                : "Add Property"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Property Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="Modern 2BHK Apartment"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="input"
                placeholder="Describe the property..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Address / Location
              </label>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="input"
                placeholder="Madhapur, Hyderabad"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="input"
                placeholder="Hyderabad"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                State
              </label>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="input"
                placeholder="Telangana"
              />

              <p className="mt-1 text-xs text-slate-400">
                Stored for display only in the current V1
                property schema.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Postal Code
              </label>

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="input"
                placeholder="500032"
              />

              <p className="mt-1 text-xs text-slate-400">
                Stored for display only in the current V1
                property schema.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Property Type
              </label>

              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className="input"
              >
                <option value="APARTMENT">
                  Apartment
                </option>

                <option value="HOUSE">
                  House
                </option>

                <option value="VILLA">
                  Villa
                </option>

                <option value="STUDIO">
                  Studio
                </option>

                <option value="PG">
                  PG
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Monthly Rent
              </label>

              <input
                name="monthlyRent"
                type="number"
                min="1"
                value={form.monthlyRent}
                onChange={handleChange}
                required
                className="input"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Security Deposit
              </label>

              <input
                name="securityDeposit"
                type="number"
                min="0"
                value={form.securityDeposit}
                onChange={handleChange}
                required
                className="input"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Bedrooms
              </label>

              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                required
                className="input"
                placeholder="2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Bathrooms
              </label>

              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                required
                className="input"
                placeholder="2"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Property"
                    : "Create Property"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                className="rounded-lg border px-6 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-8">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">
            No properties yet
          </h2>

          <p className="mt-2 text-slate-500">
            Add your first property to start receiving
            rental applications.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {properties.map((property) => {
            const propertyImages =
              images[property.id] || [];

            return (
              <article
                key={property.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold">
                        {property.title}
                      </h2>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
                        {property.status}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-500">
                      {property.city}

                      {property.location
                        ? ` · ${property.location}`
                        : ""}
                    </p>

                    <p className="mt-4 text-xl font-bold">
                      ₹
                      {Number(
                        property.monthlyRent || 0
                      ).toLocaleString("en-IN")}

                      <span className="text-sm font-normal text-slate-500">
                        {" "}
                        / month
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {property.bedrooms ?? 0} bedrooms
                      {" · "}
                      {property.bathrooms ?? 0} bathrooms
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/properties/${property.id}`}
                      className="rounded-lg border px-4 py-2 font-medium hover:bg-slate-50"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        openEdit(property)
                      }
                      className="rounded-lg border px-4 py-2 font-medium hover:bg-slate-50"
                    >
                      Edit
                    </button>

                    {property.status ===
                      "AVAILABLE" && (
                      <button
                        type="button"
                        onClick={() =>
                          deactivateProperty(
                            property.id
                          )
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      loadImages(property.id)
                    }
                    className="text-sm font-medium text-blue-600"
                  >
                    Load / Manage Images
                  </button>

                  {images[property.id] && (
                    <div className="mt-4">
                      <PropertyImageManager
                        propertyId={property.id}
                        images={propertyImages}
                        onImagesChanged={() =>
                          refreshImages(
                            property.id
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}