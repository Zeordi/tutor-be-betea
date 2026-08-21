export default function ContactPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-bold text-[var(--foreground)]">Contact Us</h1>
        <p className="mt-6 text-lg text-[var(--secondary)]">
          Have questions? We are here to help families and tutors across Ethiopia.
        </p>

        <div className="mt-12 space-y-6">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-[var(--secondary)]">support@tutorbebetea.com</p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p className="text-[var(--secondary)]">Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </div>
    </main>
  );
}
