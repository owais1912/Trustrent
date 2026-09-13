import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TENANT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(form);

      if (user.role === "LANDLORD") {
        navigate("/landlord/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1">
      <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-6 py-12">
        <div className="w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Create your account
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Join TrustRent and build your rental reputation.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                I am a
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--text)] underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}