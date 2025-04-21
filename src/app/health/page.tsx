"use client"

import { useEffect, useState } from "react";

export default function HealthCheck() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    fetch("https://api.devirl.com/health") // or your ALB URL if HTTPS isn't ready
      .then((res) => res.text())
      .then(setStatus)
      .catch(() => setStatus("Unavailable 😔"));
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dev Quest Backend Health</h1>
      <p>Status: {status}</p>
    </main>
  );
}
