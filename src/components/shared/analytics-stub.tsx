"use client";

import { useEffect } from "react";

export function AnalyticsStub() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }
    // Placeholder for analytics hooks.
  }, []);

  return null;
}
