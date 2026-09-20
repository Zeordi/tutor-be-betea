import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || String(
        process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      ),
    ),
    debug: false,
    beforeSend(event) {
      if (!event.request) return event;

      const sensitiveHeaders = [
        "authorization",
        "cookie",
        "password",
        "token",
        "secret",
      ];

      const headers = { ...(event.request.headers as Record<string, string>) };
      for (const header of sensitiveHeaders) {
        if (headers[header]) {
          headers[header] = "[REDACTED]";
        }
      }
      event.request.headers = headers;

      if (event.request.data) {
        const data = { ...(event.request.data as Record<string, unknown>) };
        for (const key of Object.keys(data)) {
          const lower = key.toLowerCase();
          if (
            lower.includes("password") ||
            lower.includes("token") ||
            lower.includes("secret") ||
            lower.includes("apikey") ||
            lower.includes("api_key")
          ) {
            data[key] = "[REDACTED]";
          }
        }
        event.request.data = data;
      }

      return event;
    },
  });

  console.log("🛡️  Sentry initialized successfully for API");
} else {
  console.log("⚠️  Sentry DSN not provided. Error tracking is inactive in dev.");
}
