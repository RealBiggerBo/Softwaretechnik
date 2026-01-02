import { Button, Paper, Stack, TextField } from "@mui/material";

function LoginPage() {
  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: 420, mx: "auto", mt: 8, px: 4, py: 5 }}
    >
      <Stack spacing={2}>
        <h2>Login</h2>
        <TextField label="Benutzername" name="username" fullWidth />
        <TextField label="Passwort" name="password" type="password" fullWidth />
        <Button variant="contained" size="large" fullWidth>
          Login
        </Button>
      </Stack>
    </Paper>
  );
}

export default LoginPage;
