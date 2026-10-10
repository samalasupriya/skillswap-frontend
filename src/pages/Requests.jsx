import { useEffect, useState } from "react";
import { api } from "../api";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const [inc, out, acc] = await Promise.all([
        api("/connections/incoming"),
        api("/connections/outgoing"),
        api("/connections/accepted"),
      ]);
      setIncoming(inc);
      setOutgoing(out);
      setAccepted(acc);
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      await api(`/connections/${id}/${action}`, "POST");
      setMsg(action === "accept" ? "Request accepted" : "Request rejected");
      await load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const pendingIncoming = incoming.filter((r) => r.status === "PENDING");
  const pendingOutgoing = outgoing.filter((r) => r.status === "PENDING");

  const card = { border: "1px solid #ccc", padding: 10, marginBottom: 10 };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Requests</h3>
      {msg && <p>{msg}</p>}

      <h4>Pending requests ({pendingIncoming.length})</h4>
      {pendingIncoming.length === 0 && <p>No pending requests.</p>}
      {pendingIncoming.map((r) => (
        <div key={r.requestId} style={card}>
          <b>{r.otherUserName}</b> wants to connect with you
          <div>
            <button onClick={() => act(r.requestId, "accept")}>Accept</button>{" "}
            <button onClick={() => act(r.requestId, "reject")}>Reject</button>
          </div>
        </div>
      ))}

      <h4>Accepted requests ({accepted.length})</h4>
      {accepted.length === 0 && <p>No accepted requests yet.</p>}
      {accepted.map((r) => (
        <div key={r.requestId} style={card}>
          ✅ Connected with <b>{r.otherUserName}</b>{" "}
          <span>({r.sentByMe ? "you sent the request" : "they sent the request"})</span>
        </div>
      ))}

      <h4>Sent by me, waiting ({pendingOutgoing.length})</h4>
      {pendingOutgoing.length === 0 && <p>No waiting requests.</p>}
      {pendingOutgoing.map((r) => (
        <div key={r.requestId} style={card}>
          Waiting for <b>{r.otherUserName}</b> to respond
        </div>
      ))}
    </div>
  );
}