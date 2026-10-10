import { useEffect, useState } from "react";
import { api } from "../api";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [partners, setPartners] = useState([]);
  const [connectionId, setConnectionId] = useState("");
  const [topic, setTopic] = useState("");
  const [when, setWhen] = useState("");
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setSessions(await api("/sessions"));
      setPartners(await api("/connections/accepted"));
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const propose = async () => {
    if (!connectionId || !topic || !when) {
      setMsg("Fill partner, topic and date/time");
      return;
    }
    try {
      await api("/sessions", "POST", {
        connectionId: Number(connectionId),
        topic,
        scheduledAt: when.length === 16 ? when + ":00" : when,
        meetingLink: link,
      });
      setMsg("Session proposed");
      setTopic("");
      setWhen("");
      setLink("");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const act = async (id, action) => {
    try {
      await api(`/sessions/${id}/${action}`, "POST");
      setMsg("Done: " + action);
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Learning Sessions</h3>
      {msg && <p>{msg}</p>}

      <h4>Propose a session</h4>
      <select value={connectionId} onChange={(e) => setConnectionId(e.target.value)}>
        <option value="">-- choose partner --</option>
        {partners.map((p) => (
          <option key={p.requestId} value={p.requestId}>{p.otherUserName}</option>
        ))}
      </select><br />
      <input
        placeholder="Topic (e.g. Java basics)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      /><br />
      <input
        type="datetime-local"
        value={when}
        onChange={(e) => setWhen(e.target.value)}
      /><br />
      <input
        placeholder="Google Meet / Zoom link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      /><br />
      <button onClick={propose}>Propose</button>

      <h4>My sessions</h4>
      {sessions.length === 0 && <p>No sessions yet.</p>}
      {sessions.map((s) => (
        <div key={s.sessionId} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <b>{s.topic}</b> with {s.otherUserName}
          <div>When: {s.scheduledAt}</div>
          <div>Status: {s.status}</div>
          {s.meetingLink && (
            <div>Link: <a href={s.meetingLink} target="_blank" rel="noreferrer">{s.meetingLink}</a></div>
          )}
          {!s.proposedByMe && (s.status === "PENDING" || s.status === "PROPOSED") && (
            <button onClick={() => act(s.sessionId, "confirm")}>Confirm</button>
          )}{" "}
          {s.status === "CONFIRMED" && (
            <button onClick={() => act(s.sessionId, "complete")}>Mark completed</button>
          )}{" "}
          {s.status !== "COMPLETED" && s.status !== "CANCELLED" && (
            <button onClick={() => act(s.sessionId, "cancel")}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}