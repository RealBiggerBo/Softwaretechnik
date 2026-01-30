import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

interface Props {
  caller: any; // oder: caller: IApiCaller
}

export default function SessionTimer({ caller }: Props) {
  const navigate = useNavigate();

  // Backend-Session läuft 10 Minuten → 600 Sekunden
  const SESSION_DURATION = 10 * 60;

  // Timer zeigt die Restzeit an
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);

  // 1. Countdown jede Sekunde
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Alle 30 Sekunden Backend fragen, ob Session noch aktiv ist
  useEffect(() => {
    const pingInterval = setInterval(async () => {
      const active = await caller.PingSession();

      if (!active) {
        // Backend hat ausgeloggt → Frontend folgt
        navigate("/login");
      } else {
        // Backend ist aktiv → Timer neu setzen
        setTimeLeft(SESSION_DURATION);
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [caller, navigate]);

  // 3. Falls Timer abläuft → sicherheitshalber Logout
  useEffect(() => {
    if (timeLeft <= 0) {
      caller.Logout();
      navigate("/login");
    }
  }, [timeLeft, caller, navigate]);

  // Zeit formatieren
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Chip
      label={`${minutes}:${seconds.toString().padStart(2, "0")}`}
      color={timeLeft < 60 ? "error" : "primary"}
      variant="outlined"
      sx={{
        ml: 2,
        fontWeight: "bold",
        fontSize: "1rem",
        padding: "0 6px"
      }}
    />
  );
}

