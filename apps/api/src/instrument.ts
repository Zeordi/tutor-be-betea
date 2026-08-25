import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    // Capture 100% of transactions in dev; adjust down in high-traffic production
    tracesSampleRate: 1.0,
    debug: false,
  });

  console.log("🛡️  Sentry initialized successfully for API");
} else {
  console.log("⚠️  Sentry DSN not provided. Error tracking is inactive in dev.");
}