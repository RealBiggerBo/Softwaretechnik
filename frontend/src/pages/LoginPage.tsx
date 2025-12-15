function LoginPage() {
  return (
    <div>
      <input
        placeholder="Benutzername"
        type="text"
        style={{ marginBottom: "1rem" }}
      />
      <input
        placeholder="Passwort"
        type="password"
        style={{ marginBottom: "1rem" }}
      />
      <br />
      <button>Login</button>
    </div>
  );
}
export default LoginPage;
