import { useIsMobile } from "../hooks/useIsMobile";
import type { Stage } from "../types";

interface StageProgressProps {
  stage: Stage;
  step: number;
}

const STAGE_STEPS: Record<string, string[]> = {
  awakening: ["H — Spread", "X/Z — Explore", "Z — Advance"],
  doubleSlit: ["H — Pass both slits", "Z — Flip phase", "✓ Clear!"],
};

export function StageProgress({ stage, step }: StageProgressProps) {
  const isMobile = useIsMobile();
  const steps = STAGE_STEPS[stage];
  if (!steps) return null;

  if (isMobile) {
    return (
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 16,
          zIndex: 15,
          display: "flex",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        {steps.map((_, i) => {
          const isCurrent = i === step;
          const isDone = i < step;
          return (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: isDone
                  ? "rgba(77,232,255,0.2)"
                  : isCurrent
                    ? "rgba(77,232,255,0.12)"
                    : "rgba(10,20,40,0.8)",
                border: isDone
                  ? "2px solid #4de8ff88"
                  : isCurrent
                    ? "2px solid #4de8ff"
                    : "2px solid #1a2a3a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: isCurrent || isDone ? "#4de8ff" : "#2a3a4a",
                fontFamily: "monospace",
                fontWeight: 700,
                animation: isCurrent ? "sphere-pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              {isDone ? "✓" : i + 1}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 56,
        left: 16,
        zIndex: 15,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      {steps.map((label, i) => {
        const isCurrent = i === step;
        const isDone = i < step;

        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Badge */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: isDone
                  ? "rgba(77,232,255,0.2)"
                  : isCurrent
                    ? "rgba(77,232,255,0.12)"
                    : "rgba(10,20,40,0.8)",
                border: isDone
                  ? "2px solid #4de8ff88"
                  : isCurrent
                    ? "2px solid #4de8ff"
                    : "2px solid #1a2a3a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: isDone ? "#4de8ff" : isCurrent ? "#4de8ff" : "#2a3a4a",
                fontFamily: "monospace",
                fontWeight: 700,
                flexShrink: 0,
                animation: isCurrent ? "sphere-pulse 1.5s ease-in-out infinite" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {isDone ? "✓" : i + 1}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: isDone
                  ? "#4de8ff66"
                  : isCurrent
                    ? "#4de8ff"
                    : "#2a3a4a",
                fontWeight: isCurrent ? 700 : 400,
                background: "rgba(8,16,32,0.7)",
                padding: "2px 6px",
                borderRadius: 4,
                backdropFilter: "blur(4px)",
                transition: "all 0.3s ease",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
