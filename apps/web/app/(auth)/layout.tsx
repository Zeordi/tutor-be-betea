import Link from "next/link";

const FEATURES = [
  ["🛡️", "Fayda ID Verified"],
  ["💰", "Escrow Protected"],
  ["📊", "AI Progress"],
  ["📍", "GPS Geofencing"],
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="grid md:grid-cols-2">
        {/* Brand panel — hidden on small screens */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[var(--primary)] to-teal-700 p-10 text-white">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/15 text-xl">
                🎓
              </div>
              <div>
                <p className="text-base font-extrabold">TUTOR BE BETEA</p>
                <p className="text-[10px] font-semibold text-white/55">ቱቶር በ ቤቴ</p>
              </div>
            </div>
            <h2 className="mt-10 text-3xl font-extrabold leading-tight">
              Ethiopia&apos;s Premier Verified Tutoring Platform
            </h2>
            <p className="mt-3 text-sm text-white/65">
              Safe, verified, and built for Ethiopian families. Every tutor verified
              through Fayda, every session protected.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {FEATURES.map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
                  <span>{icon}</span>
                  <span className="text-xs font-semibold text-white/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((letter) => (
                  <div
                    key={letter}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-xs font-bold text-white"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-xs font-semibold text-white/70">
                12,000+ families
              </span>
            </div>
            <div className="mt-4 flex h-1 rounded-full overflow-hidden">
              <div className="flex-1 bg-green-500" />
              <div className="flex-1 bg-yellow-400" />
              <div className="flex-1 bg-red-500" />
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex w-full items-center justify-center bg-[var(--background)] dark:bg-[#0A1628] px-4 py-10 md:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}