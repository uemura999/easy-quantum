import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { bloch } from "../lib/quantumEngine";
import type { QuantumState, Stage } from "../types";

interface StatusPanelProps {
  quantumState: QuantumState;
  xp: number;
  stage: Stage;
  spotlight?: boolean;
}

export function StatusPanel({ quantumState, xp, stage, spotlight }: StatusPanelProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const b = bloch(quantumState);
  const stateLabel =
    b.p0 > 0.95 ? "Settled on 0" : b.p1 > 0.95 ? "Settled on 1" : "Both 0 & 1 !";
  const stateColor =
    b.p0 > 0.95 ? "#4de8ff" : b.p1 > 0.95 ? "#ff4d6a" : "#a855f7";

  const showFull = !isMobile || expanded;

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 15,
        background: "rgba(8,16,32,0.85)",
        border: spotlight ? "2px solid rgba(77,232,255,0.8)" : "1px solid rgba(77,232,255,0.2)",
        borderRadius: 12,
        padding: "10px 14px",
        backdropFilter: "blur(8px)",
        minWidth: isMobile && !expanded ? 80 : 140,
        boxShadow: spotlight
          ? "0 0 0 4px rgba(77,232,255,0.3), 0 0 30px rgba(77,232,255,0.4)"
          : "none",
        animation: spotlight ? "sphere-pulse 1.5s ease-in-out infinite" : "none",
        transform: spotlight ? "scale(1.03)" : "scale(1)",
        transition: "all 0.2s ease",
        cursor: isMobile ? "pointer" : "default",
      }}
      onClick={isMobile ? () => setExpanded((e) => !e) : undefined}
    >
      {!showFull && (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: stateColor,
              boxShadow: `0 0 8px ${stateColor}`,
            }}
          />
          <span style={{ fontSize: 10, color: stateColor, fontFamily: "monospace" }}>
            {stateLabel.split(" ")[0]}
          </span>
          <span style={{ fontSize: 10, color: "#f59e0b", fontFamily: "monospace" }}>
            ▼ {xp}XP
          </span>
        </div>
      )}

      {showFull && (
        <>
          <div
            style={{
              fontSize: 9,
              color: "#5a7a9a",
              fontFamily: "monospace",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            STATUS{isMobile && " ▲"}
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
              <span style={{ color: "#4de8ff" }}>"0" : {(b.p0 * 100).toFixed(0)}%</span>
              <span style={{ color: "#ff4d6a" }}>"1" : {(b.p1 * 100).toFixed(0)}%</span>
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
        </>
      )}
    </div>
  );
}
