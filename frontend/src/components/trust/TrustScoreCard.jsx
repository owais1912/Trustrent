export default function TrustScoreCard({ profile }) {
  if (!profile) return null;

  const score = profile.overallScore ?? 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            Trust Score
          </p>

          <p className="mt-2 text-5xl font-bold">
            {score}
          </p>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            out of 1000
          </p>
        </div>

        <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-gray-200">
          <span className="text-xl font-bold">
            {Math.round(score / 10)}%
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ScoreItem label="Payment" value={profile.paymentScore} />
        <ScoreItem label="Rental History" value={profile.rentalHistoryScore} />
        <ScoreItem label="Reviews" value={profile.reviewScore} />
        <ScoreItem label="Care" value={profile.careScore} />
        <ScoreItem label="Compliance" value={profile.complianceScore} />
        <ScoreItem label="Complaints" value={profile.complaintScore} />
      </div>
    </div>
  );
}

function ScoreItem({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-semibold">{value ?? 0}</p>
    </div>
  );
}