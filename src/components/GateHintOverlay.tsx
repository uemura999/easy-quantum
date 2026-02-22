import { useIsMobile } from "../hooks/useIsMobile";
import type { GateKey } from "../types";

interface GateHintOverlayProps {
  hintGate: GateKey | "M" | null;
}

const GATE_COLORS: Record<string, string> = {
  H: "#4de8ff",
  X: "#ff4d6a",
  Z: "#a855f7",
  M: "#f59e0b",
};

const GATE_LABELS: Record<string, string> = {
  H: "↓ Press [H]!",
  X: "↓ Press [X]!",
  Z: "↓ Press [Z]!",
  M: "↓ Press [M] to observe!",
};

export function GateHintOverlay({ hintGate }: GateHintOverlayProps) {
  const isMobile = useIsMobile();

  if (!hintGate) return null;

  const color = GATE_COLORS[hintGate] ?? "#4de8ff";
  const label = GATE_LABELS[hintGate] ?? `↓ Press [${hintGate}]!`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "calc(160px + env(safe-area-inset-bottom))" : 160,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 16,
        animation: "hint-bounce 1.2s ease-in-out infinite",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: `rgba(8,16,32,0.88)`,
          border: `1px solid ${color}66`,
          borderRadius: 8,
          padding: "6px 14px",
          backdropFilter: "blur(6px)",
          fontSize: 12,
          fontFamily: "monospace",
          fontWeight: 700,
          color,
          whiteSpace: "nowrap",
          textShadow: `0 0 10px ${color}88`,
          boxShadow: `0 0 12px ${color}33`,
        }}
      >
        {label}
      </div>
    </div>
  );
}
