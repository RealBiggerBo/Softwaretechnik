import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { keyframes } from "@mui/system";

interface Props {
  timeoutSeconds: number;
  onTimeout: () => void;
}

// Subtiles Blinken (leichtes Pulsieren)
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.65; }
  100% { opacity: 1; }
`;

export default function SessionTimer({ timeoutSeconds, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(timeoutSeconds);

  // Reset timer on user activity
  useEffect(() => {
    const reset = () => setRemaining(timeoutSeconds);
    window.addEventListener("click", reset);

    return () => {
      window.removeEventListener("click", reset);
    };
  }, [timeoutSeconds]);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* Formatierung der Zeit */
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const isCritical = remaining <= 60;

  return (
    <Chip
      label={`${minutes}:${seconds.toString().padStart(2, "0")}`}
      color={isCritical ? "warning" : "primary"}
      sx={{
        animation: isCritical ? `${blink} 1.5s ease-in-out infinite` : "none",
        fontWeight: "bold",
      }}
    />
  );
}

