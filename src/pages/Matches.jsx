import { useEffect, useState } from "react";
import { api } from "../api";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setMatches(await api("/matches"));
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const send = async (userId) => {
    try {
      await api(`/connections/send/${userId}`, "POST");
      setMsg("Request sent");
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>My Matches</h3>
      {msg && <p>{msg}</p>}
      {matches.length === 0 && <p>No matches yet. Add more skills.</p>}
      {matches.map((m) => (
        <div key={m.userId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <b>{m.userName}</b> {m.mutual && <span>(mutual match)</span>}
          <div>They teach you: {m.theyTeachMe.length ? m.theyTeachMe.join(", ") : "-"}</div>
          <div>You teach them: {m.iTeachThem.length ? m.iTeachThem.join(", ") : "-"}</div>
          <button onClick={() => send(m.userId)}>Send request</button>
        </div>
      ))}
    </div>
  );
}