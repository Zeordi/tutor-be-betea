import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="card max-w-md w-full py-12">
        <h1 className="text-5xl font-extrabold text-[var(--primary)] mb-2">404</h1>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Page Not Found</h2>
        <p className="text-sm text-[var(--secondary)] mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}