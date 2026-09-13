type AnalyticsParams = Record<string, boolean | number | string>;

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params: AnalyticsParams) => void;
  }
}

export function trackAssessmentEvent(eventName: string, params: AnalyticsParams) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
