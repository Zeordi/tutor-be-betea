const PARENT_TIERS = [
  ["1 Referral", "100 ETB", "Plus 50 ETB session credit", "#059669"],
  ["3 Referrals", "400 ETB", "Total reward + priority support", "var(--primary)"],
  ["5 Referrals", "800 ETB", "Total + Featured Family badge", "#2DD4BF"],
  ["10 Referrals", "2,000 ETB", "Elite status + 1 free month", "#8B5CF6"],
];

const TUTOR_TIERS = [
  ["1 Tutor", "200 ETB", "Instant Telebirr payout", "#059669"],
  ["3 Tutors", "700 ETB", "Total + Boosted ranking", "var(--primary)"],
  ["5 Tutors", "1,500 ETB", "Total + Featured Tutor badge", "#F59E0B"],
  ["10 Tutors", "3,500 ETB", "Elite + zero fees for 1 mo", "#EF4444"],
];

export default function ReferralPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-4xl font-black text-[var(--foreground)] md:text-5xl">
            Earn ETB by{" "}
            <span className="text-[var(--primary)]">Referring Friends</span>
          </h1>
          <p className="mx-auto max-w-lg text-lg text-[var(--secondary)]">
            Invite parents and tutors. Rewards can be sent to Telebirr when
            conditions are met.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
            <div className="mb-4 text-4xl">👪</div>
            <h2 className="mb-2 text-2xl font-black text-[var(--foreground)]">
              For Parents
            </h2>
            <p className="mb-6 text-sm text-[var(--secondary)]">
              Refer another parent who books their first session.
            </p>
            <div className="space-y-3">
              {PARENT_TIERS.map(([tier, rew, extra, color]) => (
                <div
                  key={tier}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3.5"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-extrabold"
                    style={{ background: `${color}18`, color }}
                  >
                    {tier.split(" ")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black" style={{ color }}>
                      {rew}
                    </p>
                    <p className="text-xs text-[var(--secondary)]">{extra}</p>
                  </div>
                  <span>🎁</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
            <div className="mb-4 text-4xl">👨‍🏫</div>
            <h2 className="mb-2 text-2xl font-black text-[var(--foreground)]">
              For Tutors
            </h2>
            <p className="mb-6 text-sm text-[var(--secondary)]">
              Refer another tutor who completes their first session.
            </p>
            <div className="space-y-3">
              {TUTOR_TIERS.map(([tier, rew, extra, color]) => (
                <div
                  key={tier}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-3.5"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-extrabold"
                    style={{ background: `${color}18`, color }}
                  >
                    {tier.split(" ")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black" style={{ color }}>
                      {rew}
                    </p>
                    <p className="text-xs text-[var(--secondary)]">{extra}</p>
                  </div>
                  <span>💸</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}