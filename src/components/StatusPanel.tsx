import { bloch } from "../lib/quantumEngine";
import type { QuantumState, Stage } from "../types";

interface StatusPanelProps {
  quantumState: QuantumState;
  xp: number;
  stage: Stage;
}

export function StatusPanel({ quantumState, xp, stage }: StatusPanelProps) {
  const b = bloch(quantumState);
  const stateLabel =
    b.p0 > 0.95 ? "|0⟩ Collapsed" : b.p1 > 0.95 ? "|1⟩ Collapsed" : "Superposition";
  const stateColor =
    b.p0 > 0.95 ? "#4de8ff" : b.p1 > 0.95 ? "#ff4d6a" : "#a855f7";

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 15,
        background: "rgba(8,16,32,0.85)",
        border: "1px solid rgba(77,232,255,0.2)",
        borderRadius: 12,
        padding: "10px 14px",
        backdropFilter: "blur(8px)",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#5a7a9a",
          fontFamily: "monospace",
          letterSpacing: 1.5,
          marginBottom: 6,
        }}
      >
        STATUS
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: stateColor,
            boxShadow: `0 0 8px ${stateColor}`,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: stateColor,
            fontFamily: "monospace",
          }}
        >
          {stateLabel}
        </span>
      </div>
      <div style={{ marginBottom: 6 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            fontFamily: "monospace",
            marginBottom: 2,
          }}
        >
          <span style={{ color: "#4de8ff" }}>|0⟩ {(b.p0 * 100).toFixed(0)}%</span>
          <span style={{ color: "#ff4d6a" }}>|1⟩ {(b.p1 * 100).toFixed(0)}%</span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            background: "#0a1628",
          }}
        >
          <div
            style={{
              width: `${b.p0 * 100}%`,
              background: "#4de8ff",
              transition: "width 0.5s",
            }}
          />
          <div
            style={{
              width: `${b.p1 * 100}%`,
              background: "#ff4d6a",
              transition: "width 0.5s",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 12 }}>⚡</span>
        <span
          style={{
            fontSize: 11,
            color: "#f59e0b",
            fontFamily: "monospace",
            fontWeight: 700,
          }}
        >
          {xp} XP
        </span>
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#5a7a9a",
          fontFamily: "monospace",
          marginTop: 4,
        }}
      >
        {stage === "awakening"
          ? "WORLD 1: Awakening"
          : stage === "doubleSlit"
            ? "WORLD 2: Double Slit"
            : ""}
      </div>
    </div>
  );
}
