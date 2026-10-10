import { useState } from "react";
import { api } from "../api";

export default function Register({ onDone }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      const r = await api("/auth/register", "POST", { name, email, password });
      setMsg(r.message);
      setStep(2);
    } catch (e) {
      setMsg(e.message);
    }
  };

  const verify = async () => {
    try {
      const r = await api("/auth/verify-otp", "POST", { email, otp });
      setMsg(r.message);
      setTimeout(onDone, 1200);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      {msg && <p>{msg}</p>}
      {step === 1 ? (
        <>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
          <input placeholder="Password (min 6 characters)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
          <button onClick={register}>Register</button>
        </>
      ) : (
        <>
          <p>Enter the OTP sent to {email}</p>
          <input placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} /><br />
          <button onClick={verify}>Verify</button>
        </>
      )}
      <br />
      <button onClick={onDone}>Back to login</button>
    </div>
  );
}