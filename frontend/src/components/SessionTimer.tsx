import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";

interface Props {
  timeoutSeconds: number;
  onTimeout: () => void;
}

export default function SessionTimer({ timeoutSeconds, onTimeout }: Props) {
  const [remaining, setRemaining] = useState(timeoutSeconds);

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

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <Chip
      label={`Session: ${minutes}:${seconds.toString().padStart(2, "0")}`}
      color={remaining < 60 ? "warning" : "primary"}
    />
  );
}
