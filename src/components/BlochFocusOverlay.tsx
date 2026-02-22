import { useIsMobile } from "../hooks/useIsMobile";
import { bloch } from "../lib/quantumEngine";
import type { QuantumState, Stage } from "../types";

interface BlochFocusOverlayProps {
  active: boolean;
  quantumState: QuantumState;
  onDismiss: () => void;
  stage?: Stage;
  inline?: boolean;
}

export function BlochFocusOverlay({
  active,
  quantumState,
  onDismiss,
  stage,
  inline = false,
}: BlochFocusOverlayProps) {
  const isMobile = useIsMobile();

  if (!active) return null;

  const b = bloch(quantumState);
  const arrowColor = b.isSuperposition
    ? "#a855f7"
    : b.p0 > 0.95
      ? "#4de8ff"
      : "#ff4d6a";
  const stateLabel = b.isSuperposition
    ? "Both!"
    : b.p0 > 0.95
      ? "State 0 (Ground)"
      : "State 1 (Excited)";

  // Axis diagram sizing (smaller on mobile fixed overlay, normal when inline)
  const svgW = 60;
  const svgH = isMobile && !inline ? 80 : 120;
  const axisX = svgW / 2;
  const topY = 14;
  const botY = svgH - 14;
  const midY = (topY + botY) / 2;
  const dotY = topY + (b.theta / Math.PI) * (botY - topY);

  const isNorth = b.p0 > 0.9;
  const isSouth = b.p1 > 0.9;
  const isEq = b.isSuperposition;

  const isOnBitLesson = stage === "bitLesson";

  return (
    <div
      style={inline ? {
        position: "relative",
        width: "100%",
        marginBottom: 8,
        background: "rgba(2, 6, 14, 0.82)",
        border: "1px solid rgba(77,232,255,0.25)",
        borderRadius: 12,
        padding: "10px 12px",
        fontFamily: "monospace",
        boxSizing: "border-box",
      } : {
        position: "fixed",
        top: isMobile ? 68 : isOnBitLesson ? 165 : 80,
        left: isMobile ? "auto" : isOnBitLesson ? "auto" : 16,
        right: isMobile ? 8 : isOnBitLesson ? 12 : "auto",
        transform: "none",
        zIndex: 20,
        width: isMobile ? "min(172px, calc(100vw - 32px))" : 172,
        background: "rgba(2, 6, 14, 0.82)",
        border: "1px solid rgba(77,232,255,0.25)",
        borderRadius: 12,
        padding: "10px 12px",
        animation: "panelSlideIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        fontFamily: "monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#4de8ff",
            boxShadow: "0 0 5px #4de8ff",
          }}
        />
        <span
          style={{
            fontSize: 9,
            color: "#4de8ff",
            letterSpacing: 2,
            fontWeight: 700,
          }}
        >
          BLOCH SPHERE
        </span>
      </div>

      {/* When Bit vs Qubit: sphere labels are in overlay (3D ones hidden to avoid overflow) */}
      {isOnBitLesson && (
        <div
          style={{
            fontSize: 10,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#6a8aaa",
          }}
        >
          <span style={{ color: "#4de8ff", fontWeight: 700 }}>North = 0</span>
          <span>·</span>
          <span style={{ color: "#ff4d6a", fontWeight: 700 }}>South = 1</span>
        </div>
      )}

      {/* Axis diagram + labels */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <svg width={svgW} height={svgH} style={{ flexShrink: 0 }}>
          {/* Dashed axis */}
          <line
            x1={axisX}
            y1={topY}
            x2={axisX}
            y2={botY}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          {/* North pole region halo */}
          {isNorth && (
            <circle
              cx={axisX}
              cy={topY}
              r={10}
              fill="#4de8ff"
              opacity={0.25}
              style={{ animation: "sphere-pulse 1.5s ease-in-out infinite" }}
            />
          )}
          {/* Equator region halo */}
          {isEq && (
            <ellipse
              cx={axisX}
              cy={midY}
              rx={14}
              ry={5}
              fill="#a855f7"
              opacity={0.25}
              style={{ animation: "sphere-pulse 1.5s ease-in-out infinite" }}
            />
          )}
          {/* South pole region halo */}
          {isSouth && (
            <circle
              cx={axisX}
              cy={botY}
              r={10}
              fill="#ff4d6a"
              opacity={0.25}
              style={{ animation: "sphere-pulse 1.5s ease-in-out infinite" }}
            />
          )}
          {/* North pole dot */}
          <circle cx={axisX} cy={topY} r={4} fill="#4de8ff" />
          {/* South pole dot */}
          <circle cx={axisX} cy={botY} r={4} fill="#ff4d6a" />
          {/* Equator tick */}
          <line
            x1={axisX - 9}
            y1={midY}
            x2={axisX + 9}
            y2={midY}
            stroke="rgba(168,85,247,0.6)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          {/* Current position dot */}
          <circle cx={axisX} cy={dotY} r={5} fill={arrowColor} opacity={0.9} />
          {/* "← You" label */}
          <text
            x={axisX + 9}
            y={dotY + 4}
            fill={arrowColor}
            fontSize="8"
            fontFamily="monospace"
          >
            ← You
          </text>
        </svg>

        <div style={{ fontSize: 9, color: "#6a8aaa", lineHeight: 1.8 }}>
          <div style={{ color: "#4de8ff", fontWeight: 700 }}>0</div>
          <div>Ground</div>
          <div style={{ marginTop: 16, color: "rgba(168,85,247,0.8)" }}>
            Both!
          </div>
          <div style={{ marginTop: 16, color: "#ff4d6a", fontWeight: 700 }}>
            1
          </div>
          <div>Excited</div>
        </div>
      </div>

      {/* Probability bars */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ marginBottom: 5 }}>
          <div style={{ fontSize: 9, color: "#4de8ff", marginBottom: 2 }}>
            0: {(b.p0 * 100).toFixed(0)}%
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${b.p0 * 100}%`,
                background: "#4de8ff",
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, color: "#ff4d6a", marginBottom: 2 }}>
            1: {(b.p1 * 100).toFixed(0)}%
          </div>
          <div
            style={{
              height: 4,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${b.p1 * 100}%`,
                background: "#ff4d6a",
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* State badge */}
      <div
        style={{
          padding: "4px 8px",
          background: `${arrowColor}22`,
          border: `1px solid ${arrowColor}55`,
          borderRadius: 6,
          fontSize: 9,
          color: arrowColor,
          textAlign: "center",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {stateLabel}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        style={{
          width: "100%",
          padding: "4px",
          background: "rgba(90,122,154,0.15)",
          border: "1px solid rgba(90,122,154,0.3)",
          borderRadius: 6,
          color: "#5a7a9a",
          fontSize: 9,
          cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        [×] Close
      </button>
    </div>
  );
}
