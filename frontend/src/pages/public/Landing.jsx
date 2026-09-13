import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-[var(--secondary)]">
            TRUST-BASED RENTAL PLATFORM
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] md:text-5xl">
            Find a trusted home.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Explore properties with transparent costs and understand the
            landlord's rental reputation before you apply.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/properties"
              className="rounded-md bg-[var(--primary)] px-5 py-3 font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              Find a Property
            </Link>

            <Link
              to="/register"
              className="rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-3 font-medium text-[var(--text)] hover:bg-slate-50"
            >
              Create Your Trust Profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}