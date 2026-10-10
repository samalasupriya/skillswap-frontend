import { useEffect, useState } from "react";
import { api } from "../api";

export default function Skills() {
  const [all, setAll] = useState([]);
  const [mine, setMine] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("TEACH");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      setAll(await api("/skills"));
      setMine(await api("/skills/my"));
    } catch (e) {
      setMsg(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    const skillName = name.trim().replace(/\s+/g, " ");
    if (!skillName) { setMsg("Type a skill first"); return; }
    try {
      await api("/skills/my", "POST", { skillName, type });
      setMsg(`Added "${skillName}"`);
      setName("");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const remove = async (id) => {
    try {
      await api(`/skills/my/${id}`, "DELETE");
      load();
    } catch (e) {
      setMsg(e.message);
    }
  };

  const list = (t) => mine.filter((m) => m.type === t);

  return (
    <div style={{ marginTop: 20 }}>
      <h3>My Skills</h3>

      <input
        list="skill-options"
        placeholder="Type any skill (e.g. Guitar, Photoshop, Spanish)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && add()}
        style={{ width: 320 }}
      />
      <datalist id="skill-options">
        {all.map((s) => <option key={s.id} value={s.name} />)}
      </datalist>{" "}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="TEACH">I can teach</option>
        <option value="LEARN">I want to learn</option>
      </select>{" "}
      <button onClick={add}>Add</button>
      {msg && <p>{msg}</p>}

      <h4>I can teach</h4>
      {list("TEACH").length === 0 && <p>Nothing added yet.</p>}
      {list("TEACH").map((m) => (
        <div key={m.id}>{m.skillName} <button onClick={() => remove(m.id)}>Remove</button></div>
      ))}

      <h4>I want to learn</h4>
      {list("LEARN").length === 0 && <p>Nothing added yet.</p>}
      {list("LEARN").map((m) => (
        <div key={m.id}>{m.skillName} <button onClick={() => remove(m.id)}>Remove</button></div>
      ))}
    </div>
  );
}