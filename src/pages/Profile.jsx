import { useEffect, useState } from "react";
import { api } from "../api";

export default function Profile() {
  const [p, setP] = useState(null);
  const [form, setForm] = useState({ headline: "", bio: "", location: "", availability: "" });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api("/profile/me");
      setP(data);
      setForm({
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        availability: data.availability || "",
      });
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      await api("/profile/me", "PUT", form);
      setMsg("Profile saved");
      await load();
    } catch (e) {
      setMsg(e.message);
    }
    setSaving(false);
  };

  const skills = p?.skills || [];
  const teach = skills.filter((s) => s.type === "TEACH");
  const learn = skills.filter((s) => s.type === "LEARN");
  const name = p?.name || "";

  return (
    <div>
      <h3>My Profile</h3>
      {msg && <p>{msg}</p>}

      <div className="profile-grid">
        <div className="profile-form">
          <label>Headline</label>
          <input
            placeholder="e.g. Java developer and guitar enthusiast"
            value={form.headline}
            onChange={set("headline")}
            maxLength={120}
          />

          <label>About me</label>
          <textarea
            rows={6}
            placeholder="Tell others what you are good at, what you have built, and what you want to learn."
            value={form.bio}
            onChange={set("bio")}
            maxLength={1000}
          />
          <div className="counter">{form.bio.length} / 1000</div>

          <label>Location</label>
          <input
            placeholder="e.g. Hyderabad, India"
            value={form.location}
            onChange={set("location")}
            maxLength={100}
          />

          <label>Availability</label>
          <input
            placeholder="e.g. Weekday evenings, Sundays"
            value={form.availability}
            onChange={set("availability")}
            maxLength={200}
          />

          <button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="profile-name">{name}</div>
          <div className="profile-headline">{form.headline || "Add a headline"}</div>
          <div className="profile-meta">
            {form.location && <span>📍 {form.location}</span>}
            {form.availability && <span>🕒 {form.availability}</span>}
          </div>

          <div className="profile-label">About</div>
          <p className="profile-bio">{form.bio || "Your story will appear here."}</p>

          <div className="profile-label">Can teach</div>
          <div>
            {teach.length === 0 && <span className="muted">Add skills on the Skills tab</span>}
            {teach.map((s) => <span className="chip" key={s.id}>{s.skillName}</span>)}
          </div>

          <div className="profile-label">Wants to learn</div>
          <div>
            {learn.length === 0 && <span className="muted">Add skills on the Skills tab</span>}
            {learn.map((s) => <span className="chip learn" key={s.id}>{s.skillName}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}