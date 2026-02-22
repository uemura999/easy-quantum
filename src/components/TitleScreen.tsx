import { useState } from "react";
import type { LevelMode } from "../types";
import { useIsMobile } from "../hooks/useIsMobile";

interface TitleScreenProps {
  onStart: (mode: LevelMode) => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [view, setView] = useState<"title" | "select">("title");
  const isMobile = useIsMobile();

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    key: i,
    opacity: 0.2 + (((i * 37 + 13) % 10) / 10) * 0.4,
    left: `${(i * 73 + 11) % 100}%`,
    top: `${(i * 53 + 7) % 100}%`,
    duration: `${4 + ((i * 17) % 6)}s`,
    delay: `${(i * 23) % 5}s`,
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(13,27,50,0.97), rgba(2,5,10,0.99))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: isMobile && view === "select" ? "flex-start" : "center",
        overflowY: "auto",
      }}
    >
      {/* Particle background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.key}
            style={{
              position: "absolute",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: `rgba(77,232,255,${p.opacity})`,
              left: p.left,
              top: p.top,
              animation: `floatParticle ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {view === "title" ? (
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <div
            style={{
              fontSize: 14,
              color: "#4de8ff",
              fontFamily: "monospace",
              letterSpacing: 4,
              marginBottom: 16,
              opacity: 0.7,
            }}
          >
            QUANTUM EDTECH RPG
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 56px)",
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              background:
                "linear-gradient(135deg, #4de8ff 0%, #a855f7 40%, #ff4d6a 70%, #f59e0b 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            Q-Villager
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#5a7a9a",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 36,
              letterSpacing: 2,
            }}
          >
            Explore the quantum world as a wave packet
          </p>

          {/* Chen's speech bubble */}
          <div
            style={{
              display: "inline-block",
              background: "rgba(15,30,55,0.85)",
              border: "1px solid rgba(77,232,255,0.3)",
              borderRadius: 16,
              padding: "20px 28px",
              maxWidth: 480,
              marginBottom: 40,
              textAlign: "left",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 8, color: "#4de8ff" }}>🧒 Chen</div>
            <div
              style={{
                fontSize: 15,
                color: "#c8dff0",
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.7,
              }}
            >
              "The rules of common sense don't apply here.
              <br />
              Welcome to the quantum world — where you can be in two places at once."
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setView("select")}
              style={{
                padding: "16px 48px",
                borderRadius: 14,
                border: "2px solid rgba(77,232,255,0.5)",
                background:
                  "linear-gradient(135deg, rgba(77,232,255,0.15), rgba(168,85,247,0.1))",
                color: "#4de8ff",
                fontSize: 18,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: 2,
                boxShadow: "0 0 30px rgba(77,232,255,0.15)",
                transition: "all 0.3s",
              }}
            >
              Select Your Level →
            </button>
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 11,
              color: "#3a5070",
              fontFamily: "monospace",
            }}
          >
            [H] [X] [Z] [M] keys or click buttons to play
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 900,
            padding: isMobile ? "24px 24px 40px" : "0 24px",
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            onClick={() => setView("title")}
            style={{
              background: "none",
              border: "1px solid rgba(77,232,255,0.3)",
              color: "#4de8ff",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              padding: "6px 16px",
              borderRadius: 8,
              marginBottom: 28,
              letterSpacing: 1,
            }}
          >
            ← Back
          </button>

          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#c8dff0",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Choose Your Starting Point
          </h2>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexDirection: isMobile ? "column" : "row",
              flexWrap: isMobile ? "nowrap" : "wrap",
              alignItems: isMobile ? "stretch" : undefined,
            }}
          >
            {/* Beginner card */}
            <LevelCard
              accentColor="#4de8ff"
              badge="🟢 BEGINNER"
              title="Bit vs Qubit"
              description="No prior knowledge needed. Learn the #1 difference between classical and quantum computers — with your own hands."
              onSelect={() => onStart("beginner")}
              isMobile={isMobile}
            />
            {/* Post-Basics card */}
            <LevelCard
              accentColor="#a855f7"
              badge="🔵 POST-BASICS"
              title="Awakening — WORLD 1"
              description="You know the basics. Now put them to work. Master quantum gates: spread, flip, and phase."
              onSelect={() => onStart("intermediate")}
              isMobile={isMobile}
            />
            {/* Advanced card */}
            <LevelCard
              accentColor="#ff4d6a"
              badge="🔴 ADVANCED"
              title="Double Slit — WORLD 2"
              description="Jump straight into the famous double-slit experiment. Use quantum interference to navigate."
              onSelect={() => onStart("advanced")}
              isMobile={isMobile}
            />
            
          </div>
          <div style={{ height: 28 }} />
        </div>
      )}
    </div>
  );
}

interface LevelCardProps {
  accentColor: string;
  badge: string;
  title: string;
  description: string;
  onSelect: () => void;
  isMobile?: boolean;
}

function LevelCard({ accentColor, badge, title, description, onSelect, isMobile }: LevelCardProps) {
  return (
    <div
      style={{
        flex: "1 1 auto",
        maxWidth: isMobile ? undefined : 280,
        width: isMobile ? "100%" : undefined,
        background: "rgba(10,20,40,0.85)",
        border: `1px solid ${accentColor}44`,
        borderRadius: 16,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          letterSpacing: 2,
          color: accentColor,
          fontWeight: 700,
        }}
      >
        {badge}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#e0e8f0",
          fontFamily: "'Space Grotesk', sans-serif",
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#7a9ab8",
          fontFamily: "'Space Grotesk', sans-serif",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {description}
      </div>
      <button
        type="button"
        onClick={onSelect}
        style={{
          padding: "10px 0",
          borderRadius: 10,
          border: `2px solid ${accentColor}88`,
          background: `${accentColor}18`,
          color: accentColor,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: 1,
          transition: "all 0.2s",
          marginTop: 4,
        }}
      >
        Start →
      </button>
    </div>
  );
}
