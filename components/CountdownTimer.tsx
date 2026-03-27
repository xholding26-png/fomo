"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | "critical" | "expired">("normal");

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const exp = new Date(expiresAt).getTime();
      const diff = exp - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        setUrgency("expired");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (diff < 60000) {
        setUrgency("critical");
        setTimeLeft(`${seconds}s`);
      } else if (diff < 300000) {
        setUrgency("urgent");
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setUrgency("normal");
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const colorClass =
    urgency === "expired"
      ? "text-red-500"
      : urgency === "critical"
      ? "text-red-400 timer-critical"
      : urgency === "urgent"
      ? "text-fomo-amber timer-urgent"
      : "text-fomo-amber";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-fomo-bg px-2.5 py-1 text-xs font-mono font-bold ${colorClass}`}>
      {urgency !== "expired" && <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {timeLeft}
    </span>
  );
}
