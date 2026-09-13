import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    {
      title: "My Properties",
      description: "Create and manage your rental properties.",
      path: "/landlord/properties",
    },
    {
      title: "Applications",
      description: "Review and manage tenant applications.",
      path: "/landlord/applications",
    },
    {
      title: "My Rentals",
      description: "View your active rental agreements.",
      path: "/landlord/rentals",
    },
    {
      title: "Payments",
      description: "View rental payment activity.",
      path: "/landlord/payments",
    },
    {
      title: "Reviews",
      description: "View reviews received from tenants.",
      path: "/landlord/reviews",
    },
  ];

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your properties and rental relationships.
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