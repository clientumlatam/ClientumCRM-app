type AnalyticsCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: AnalyticsCommand;
  }
}

let analyticsMeasurementId = "";

export function initializeAnalytics(): void {
  if (typeof window === "undefined" || window.gtag) return;

  const measurementId = String(
    (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_GOOGLE_ANALYTICS_ID || "",
  ).trim();
  if (!/^G-[A-Z0-9-]+$/i.test(measurementId)) return;

  analyticsMeasurementId = measurementId;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
): void {
  if (!analyticsMeasurementId || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, parameters || {});
}