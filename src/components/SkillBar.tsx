import type { Stage } from "../types";
import type { GateKey } from "../types";

interface SkillBarProps {
  onGate: (gate: GateKey) => void;
  onMeasure: () => void;
  unlockedGates: GateKey[];
  stage: Stage;
}

const GATES: { key: GateKey; label: string; sublabel: string; color: string; icon: string }[] = [
  { key: "H", label: "H", sublabel: "Spread", color: "#4de8ff", icon: "🌀" },
  { key: "X", label: "X", sublabel: "Flip", color: "#ff4d6a", icon: "↕️" },
  { key: "Z", label: "Z", sublabel: "Phase", color: "#a855f7", icon: "🔮" },
];

export function SkillBar({
  onGate,
  onMeasure,
  unlockedGates,
  stage,
}: SkillBarProps) {
  if (stage === "prologue" || stage === "complete") return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 15,
        display: "flex",
        gap: 10,
      }}
    >
      {GATES.map((g) => {
        const unlocked = unlockedGates.includes(g.key);
        return (
          <button
            key={g.key}
            type="button"
            onClick={() => unlocked && onGate(g.key)}
            disabled={!unlocked}
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              border: `2px solid ${unlocked ? g.color + "66" : "#1a2a3a"}`,
              background: unlocked
                ? `linear-gradient(135deg, ${g.color}15, ${g.color}08)`
                : "rgba(10,15,25,0.8)",
              color: unlocked ? g.color : "#2a3a4a",
              cursor: unlocked ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              transition: "all 0.2s",
              opacity: unlocked ? 1 : 0.4,
              backdropFilter: "blur(4px)",
            }}
          >
            <span style={{ fontSize: 20 }}>{g.icon}</span>
            <span
              style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}
            >
              [{g.key}]
            </span>
            <span style={{ fontSize: 8, opacity: 0.7 }}>{g.sublabel}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onMeasure}
        style={{
          width: 72,
          height: 72,
          borderRadius: 14,
          border: "2px solid #f59e0b44",
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.04))",
          color: "#f59e0b",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          backdropFilter: "blur(4px)",
        }}
      >
        <span style={{ fontSize: 20 }}>👁️</span>
        <span
          style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}
        >
          [M]
        </span>
        <span style={{ fontSize: 8, opacity: 0.7 }}>Observe</span>
      </button>
    </div>
  );
}
