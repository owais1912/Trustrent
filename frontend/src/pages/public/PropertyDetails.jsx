import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import propertyService from "../../services/propertyService";

export default function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProperty();
    loadImages();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperty(id);
      setProperty(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load property"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      setImageLoading(true);

      const data =
        await propertyService.getPropertyImages(id);

      setImages(data || []);

      if (data?.length > 0) {
        setSelectedImage(data[0]);
      }
    } catch (err) {
      console.error("Unable to load property images", err);
    } finally {
      setImageLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border bg-white p-8">
          Loading property...
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-xl border bg-white p-8">
          <p className="text-red-600">
            {error || "Property not found"}
          </p>

          <Link
            to="/properties"
            className="mt-4 inline-block text-blue-600"
          >
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        to="/properties"
        className="mb-6 inline-block text-sm text-blue-600"
      >
        ← Back to properties
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <section>
          <div className="overflow-hidden rounded-2xl border bg-white">
            {selectedImage ? (
              <img
                src={selectedImage.imageUrl}
                alt={property.title}
                className="h-[420px] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-500">
                {imageLoading
                  ? "Loading images..."
                  : "No images available"}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className={`overflow-hidden rounded-lg border-2 ${
                    selectedImage?.id === image.id
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image.imageUrl}
                    alt=""
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Property information */}
        <section>
          <div className="rounded-2xl border bg-white p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {property.title}
                </h1>

                <p className="mt-2 text-slate-500">
                  {property.city}
                  {property.address
                    ? ` · ${property.address}`
                    : ""}
                </p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {property.status}
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Monthly Rent
                </p>
                <p className="mt-1 text-xl font-bold">
                  ₹{Number(property.monthlyRent || 0).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Security Deposit
                </p>
                <p className="mt-1 text-xl font-bold">
                  ₹{Number(property.securityDeposit || 0).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Bedrooms
                </p>
                <p className="mt-1 text-xl font-bold">
                  {property.bedrooms ?? "-"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Bathrooms
                </p>
                <p className="mt-1 text-xl font-bold">
                  {property.bathrooms ?? "-"}
                </p>
              </div>
            </div>

            {property.description && (
              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">
                  Description
                </h2>

                <p className="leading-7 text-slate-600">
                  {property.description}
                </p>
              </div>
            )}

            <div className="border-t pt-5">
              <h2 className="mb-2 text-lg font-semibold">
                Landlord
              </h2>

              <p className="text-slate-600">
                {property.landlordName ||
                  property.landlord?.name ||
                  "Verified landlord"}
              </p>
            </div>

            {property.status === "AVAILABLE" && (
              <Link
                to={`/login?redirect=/properties/${id}`}
                className="mt-6 block rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
              >
                Login to Apply
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}