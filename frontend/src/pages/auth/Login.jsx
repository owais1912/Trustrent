import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const user = await login(form.email, form.password);

      if (user.role === "LANDLORD") {
        navigate("/landlord/dashboard");
      } else {
        navigate("/tenant/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid email or password."
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
            Welcome back
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Sign in to your TrustRent account.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--text)] underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}