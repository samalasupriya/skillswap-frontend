import { useEffect, useState } from "react";
import { api } from "../api";

export default function Reviews() {
  const [done, setDone] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [summaries, setSummaries] = useState({});

  const load = async () => {
    try {
      const all = await api("/sessions");
      const completed = all.filter((s) => s.status === "COMPLETED");
      setDone(completed);

      const ids = [...new Set(completed.map((s) => s.otherUserId))];
      const result = {};
      for (const id of ids) {
        result[id] = await api(`/reviews/user/${id}`);
      }
      setSummaries(result);
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!sessionId) { setMsg("Choose a completed session"); return; }
    try {
      await api("/reviews", "POST", {
        sessionId: Number(sessionId),
        rating: Number(rating),
        comment,
      });
      setMsg("Review submitted");
      setComment("");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Reviews</h3>
      {msg && <p>{msg}</p>}

      <h4>Rate a completed session</h4>
      <select value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
        <option value="">-- choose session --</option>
        {done.map((s) => (
          <option key={s.sessionId} value={s.sessionId}>
            {s.topic} with {s.otherUserName}
          </option>
        ))}
      </select><br />
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
      </select><br />
      <input placeholder="Feedback" value={comment} onChange={(e) => setComment(e.target.value)} /><br />
      <button onClick={submit}>Submit review</button>

      <h4>Ratings of my partners</h4>
      {Object.keys(summaries).length === 0 && <p>No ratings yet.</p>}
      {Object.entries(summaries).map(([id, r]) => {
        const name = done.find((s) => String(s.otherUserId) === id)?.otherUserName;
        return (
          <div key={id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <b>{name}</b>: {r.averageRating} / 5 ({r.count} review{r.count === 1 ? "" : "s"})
            {r.reviews.map((x, i) => (
              <div key={i}>{x.reviewer}: {x.rating} - {x.comment}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}