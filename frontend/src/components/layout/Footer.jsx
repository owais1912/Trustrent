export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} TrustRent. Rental decisions built on trust.
          </p>

          <p className="text-sm text-[var(--muted)]">
            Transparent rental information and reputation.
          </p>
        </div>
      </div>
    </footer>
  );
}