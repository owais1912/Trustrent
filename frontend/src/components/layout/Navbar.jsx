import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="border-b border-[var(--border)] bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          TrustRent
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/properties" className="text-sm font-medium hover:opacity-70">
            Properties
          </Link>

          <Link
            to="/how-it-works"
            className="text-sm font-medium hover:opacity-70"
          >
            How It Works
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:opacity-70"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to={
                  user?.role === "LANDLORD"
                    ? "/landlord/dashboard"
                    : "/tenant/dashboard"
                }
                className="text-sm font-medium hover:opacity-70"
              >
                Dashboard
              </Link>

              <span className="text-sm text-[var(--text-secondary)]">
                {user?.name || user?.email}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}