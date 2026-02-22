import type { Stage } from "../types";

interface StageIndicatorProps {
  stage: Stage;
}

export function StageIndicator({ stage }: StageIndicatorProps) {
  if (stage === "prologue" || stage === "complete") return null;

  const config: Record<string, { world: string; label: string }> = {
    bitLesson:  { world: "INTRO",   label: "Bit vs Qubit" },
    awakening:  { world: "WORLD 1", label: "Awakening Chamber" },
    doubleSlit: { world: "WORLD 2", label: "Double Slit Wall" },
  };

  const c = config[stage];
  if (!c) return null;

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
        {c.world}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#e0e8f0",
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {c.label}
      </div>
    </div>
  );
}
