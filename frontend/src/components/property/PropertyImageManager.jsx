import { useState } from "react";
import propertyService from "../../services/propertyService";

export default function PropertyImageManager({
  propertyId,
  images,
  onImagesChanged,
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addImage = async (event) => {
    event.preventDefault();

    if (!imageUrl.trim()) {
      setError("Enter an image URL");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await propertyService.addPropertyImage(
        propertyId,
        imageUrl.trim(),
        images.length
      );

      setImageUrl("");

      if (onImagesChanged) {
        await onImagesChanged();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add image"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) {
      return;
    }

    try {
      setError("");

      await propertyService.deletePropertyImage(
        imageId
      );

      if (onImagesChanged) {
        await onImagesChanged();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete image"
      );
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="text-xl font-semibold">
        Property Images
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Add up to 10 property images using image URLs.
      </p>

      <form
        onSubmit={addImage}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="url"
          value={imageUrl}
          onChange={(event) =>
            setImageUrl(event.target.value)
          }
          placeholder="https://example.com/property.jpg"
          className="input flex-1"
        />

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Image"}
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <div className="mt-6 rounded-lg bg-slate-50 p-6 text-center text-slate-500">
          No images added yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border"
            >
              <img
                src={image.imageUrl}
                alt=""
                className="h-32 w-full object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  deleteImage(image.id)
                }
                className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}