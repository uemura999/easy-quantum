import type { Stage } from "../types";

interface StageIndicatorProps {
  stage: Stage;
}

export function StageIndicator({ stage }: StageIndicatorProps) {
  if (stage === "prologue") return null;

  const label =
    stage === "awakening" ? "Awakening Chamber" : "Double Slit Wall";
  const world = stage === "awakening" ? "WORLD 1" : "WORLD 2";

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 15,
        background: "rgba(8,16,32,0.8)",
        border: "1px solid rgba(77,232,255,0.15)",
        borderRadius: 8,
        padding: "6px 12px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#5a7a9a",
          fontFamily: "monospace",
          letterSpacing: 1,
        }}
      >
        {world}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#e0e8f0",
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
}
