import { useState } from "react";
import { api } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const d = await api("/auth/login", "POST", { email, password });
      localStorage.setItem("token", d.token);
      localStorage.setItem("userId", d.userId);
      localStorage.setItem("name", d.name || "");
      onLogin();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 16 }}>
      <h2>SkillSwap Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={submit}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}