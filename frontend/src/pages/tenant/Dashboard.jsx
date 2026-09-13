import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "Trust Profile",
      description: "View your TrustRent score and reputation.",
      path: "/tenant/trust-profile",
    },
    {
      title: "Properties",
      description: "Find available rental properties.",
      path: "/properties",
    },
    {
      title: "Applications",
      description: "Track your rental applications.",
      path: "/tenant/applications",
    },
    {
      title: "My Rentals",
      description: "View your active rental agreements.",
      path: "/tenant/rentals",
    },
    {
      title: "Rent & Payments",
      description: "Record and review your rent payments.",
      path: "/tenant/payments",
    },
    {
      title: "Reviews",
      description: "Review your rental experience.",
      path: "/tenant/reviews",
    },
  ];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your TrustRent rental journey.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-bold">
                {card.title}
              </h2>

              <p className="mt-2 text-gray-500">
                {card.description}
              </p>

              <span className="mt-5 inline-block font-semibold">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}