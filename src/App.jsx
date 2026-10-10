import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Skills from "./pages/Skills";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Sessions from "./pages/Sessions";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";

const TABS = {
  Skills: <Skills />,
  Matches: <Matches />,
  Requests: <Requests />,
  Sessions: <Sessions />,
  Reviews: <Reviews />,
  Profile: <Profile />,
};

const ICONS = {
  Skills: "🛠️",
  Matches: "🤝",
  Requests: "📨",
  Sessions: "📅",
  Reviews: "⭐",
  Profile: "👤",
};

function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="logo">SkillSwap</div>
        <h1>Teach what you know.<br />Learn what you love.</h1>
        <p>Swap skills with people who have exactly what you want to learn.</p>
        <ul>
          <li>🎯 Smart skill matching</li>
          <li>📅 Schedule live sessions</li>
          <li>⭐ Rate and review your partners</li>
        </ul>
      </div>
      <div className="auth-side">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [tab, setTab] = useState("Skills");

  if (!loggedIn) {
    if (showRegister) {
      return (
        <AuthShell>
          <Register onDone={() => setShowRegister(false)} />
        </AuthShell>
      );
    }
    return (
      <AuthShell>
        <Login onLogin={() => setLoggedIn(true)} />
        <div className="auth-switch">
          New here? <button onClick={() => setShowRegister(true)}>Create an account</button>
        </div>
      </AuthShell>
    );
  }

  const name = localStorage.getItem("name") || "";

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">SkillSwap</div>
        <div className="userbox">
          <div className="avatar">{name.charAt(0).toUpperCase()}</div>
          <span>Welcome, <b>{name}</b></span>
          <button className="ghost" onClick={() => { localStorage.clear(); setLoggedIn(false); }}>
            Logout
          </button>
        </div>
      </div>

      <div className="tabs">
        {Object.keys(TABS).map((t) => (
          <button
            key={t}
            className={tab === t ? "tab active" : "tab"}
            onClick={() => setTab(t)}
          >
            {ICONS[t]} {t}
          </button>
        ))}
      </div>

      <div className="panel">{TABS[tab]}</div>
    </div>
  );
}