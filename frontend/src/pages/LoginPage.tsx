import { Alert, Button, Paper, Stack, TextField } from "@mui/material";
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  caller: IApiCaller;
  onLogin: () => void;
}

function LoginPage({ caller, onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await caller.TryLogin(username, password);
      if (result.success) {
        onLogin();
        navigate("/main");
        return;
      }
      setError(result.errorMsg || "Login fehlgeschlagen.");
    } catch {
      setError("Login fehlgeschlagen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 420, mx: "auto", mt: 8, px: 4, py: 5 }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack spacing={2}>
        <h2>Login</h2>
        <TextField
          label="Benutzername"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Passwort"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          fullWidth
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
        >
          Login
        </Button>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
