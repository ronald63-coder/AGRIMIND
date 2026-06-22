"use client";
import { useState } from "react";

function RoleAvatar({ src, alt, size = 40, fallback = "🌿", color = "#22c55e" }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: color + "22", border: "2px solid " + color + "44",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.45
      }}>{fallback}</div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      style={{
        width: size, height: size, borderRadius: "50%",
        objectFit: "cover", border: "2px solid " + color + "44"
      }}
    />
  );
}

import FarmerDashboard from "./farmer/FarmerDashboard";
import MachineDashboard from "./machine/MachineDashboard";

const USER_TYPES = [
  { id: "farmer",     icon: "👨‍🌾", label: "Farmer",            color: "#22c55e" },
  { id: "extension",  icon: "👮",  label: "Extension Officer", color: "#3b82f6" },
  { id: "cooperative",icon: "🏛",  label: "Cooperative",       color: "#14b8a6" },
  { id: "dealer",     icon: "🏪",  label: "Agro Dealer",       color: "#f59e0b" },
  { id: "researcher", icon: "📚",  label: "Researcher",        color: "#a855f7" },
  { id: "govt",       icon: "🏛",  label: "Government",        color: "#06b6d4" },
  { id: "investor",   icon: "💼",  label: "Investor",          color: "#f50057" },
];

export default function App() {
  const [phase, setPhase] = useState("landing"); // landing | platform
  const [userType, setUserType] = useState("farmer");

  // ── PLATFORM PHASE ──────────────────────────────────────────────
  if (phase === "platform") {
    if (userType === "farmer") {
      return (
        <FarmerDashboard
          onSwitchToMachine={() => setUserType("extension")}
        />
      );
    }
    return (
      <MachineDashboard
        onSwitchFarmer={() => setUserType("farmer")}
      />
    );
  }

  // ── LANDING PHASE ────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#030a05",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter',sans-serif", padding: 24,
    }}>
      <div style={{ fontSize: 42, marginBottom: 16 }}>🌿</div>
      <h1 style={{
        fontSize: 36, fontWeight: 800, color: "#22c55e",
        marginBottom: 6, fontFamily: "'Inter'",
      }}>AgriMind</h1>
      <p style={{ fontSize: 14, color: "#4d7a4d", marginBottom: 36 }}>
        The Machine for Agriculture — Select your role to enter
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
        gap: 10, maxWidth: 680, width: "100%", marginBottom: 28,
      }}>
        {USER_TYPES.map(u => (
          <div key={u.id}
            onClick={() => setUserType(u.id)}
            style={{
              background: userType === u.id ? u.color + "22" : "#0c1a0e",
              border: "1px solid " + (userType === u.id ? u.color + "66" : "#1a2e1a"),
              borderRadius: 12, padding: "16px 12px",
              cursor: "pointer", textAlign: "center",
              transition: "all .2s",
            }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <RoleAvatar
                src={u.id === "farmer" ? "/avatars/farmer-john.png" :
                     u.id === "extension" ? "/avatars/extension.png" :
                     u.id === "cooperative" ? "/avatars/cooperative.png" :
                     u.id === "dealer" ? "/avatars/dealer.png" :
                     u.id === "researcher" ? "/avatars/researcher.png" :
                     u.id === "govt" ? "/avatars/govt.png" :
                     u.id === "investor" ? "/avatars/investor.png" : ""}
                alt={u.label}
                size={40}
                fallback={u.icon}
                color={u.color}
              />
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: userType === u.id ? u.color : "#7aaa7a",
            }}>
              {u.label}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setPhase("platform")}
        style={{
          background: "#22c55e", color: "#000", border: "none",
          borderRadius: 10, padding: "12px 32px", fontSize: 15,
          fontWeight: 700, cursor: "pointer", fontFamily: "'Inter'",
        }}>
        Enter AgriMind →
      </button>
    </div>
  );
}