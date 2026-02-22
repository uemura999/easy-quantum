import { useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { bloch } from "../lib/quantumEngine";
import type { QuantumState } from "../types";

interface BitComparePanelProps {
  quantumState: QuantumState;
  step: 0 | 1 | 2 | 3;
}

const STEPS = [
  { label: "① Start: State 0" },
  { label: "② H → Both states!" },
  { label: "③ Observe → Pick one" },
  { label: "✓ Complete!" },
];

export function BitComparePanel({ quantumState, step }: BitComparePanelProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const b = bloch(quantumState);

  const classicalLabel = b.isSuperposition ? "??" : b.p0 > 0.5 ? "0" : "1";
  const classicalIsError = b.isSuperposition;

  const stateLabel = b.isSuperposition
    ? "0+1"
    : b.p0 > 0.95
      ? "0"
      : "1";

  // Mobile collapsed: pill badge
  if (isMobile && !expanded) {
    return (
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 12,
          zIndex: 15,
          background: "rgba(8,16,32,0.85)",
          border: "1px solid rgba(77,232,255,0.25)",
          borderRadius: 14,
          padding: "4px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          backdropFilter: "blur(4px)",
        }}
        onClick={() => setExpanded(true)}
      >
        <span
          style={{
            fontSize: 9,
            color: "#4de8ff",
            fontFamily: "monospace",
          }}
        >
          📊 BIT vs QUBIT ▼
        </span>
      </div>
    );
  }

  // Mobile expanded: fixed center modal
  if (isMobile && expanded) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 25,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setExpanded(false)}
      >
        <div
          style={{
            width: "min(320px, calc(100vw - 32px))",
            background: "rgba(8,16,32,0.95)",
            borderRadius: 16,
            border: "1px solid rgba(77,232,255,0.3)",
            padding: 16,
            fontFamily: "monospace",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <BitComparePanelContent
            classicalLabel={classicalLabel}
            classicalIsError={classicalIsError}
            stateLabel={stateLabel}
            b={b}
            step={step}
          />
          <button
            type="button"
            onClick={() => setExpanded(false)}
            style={{
              marginTop: 12,
              width: "100%",
              padding: "6px",
              background: "rgba(90,122,154,0.15)",
              border: "1px solid rgba(90,122,154,0.3)",
              borderRadius: 8,
              color: "#5a7a9a",
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            [×] Close
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 16,
        zIndex: 15,
        width: 220,
        background: "rgba(8,16,32,0.88)",
        border: "1px solid rgba(77,232,255,0.2)",
        borderRadius: 12,
        padding: "12px",
        backdropFilter: "blur(8px)",
        animation: "panelSlideIn 0.5s ease both",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#4de8ff",
          letterSpacing: 1.5,
          marginBottom: 10,
        }}
      >
        Classical Bit vs Qubit
      </div>
      <BitComparePanelContent
        classicalLabel={classicalLabel}
        classicalIsError={classicalIsError}
        stateLabel={stateLabel}
        b={b}
        step={step}
      />
    </div>
  );
}

interface ContentProps {
  classicalLabel: string;
  classicalIsError: boolean;
  stateLabel: string;
  b: { p0: number; p1: number; isSuperposition: boolean };
  step: 0 | 1 | 2 | 3;
}

function BitComparePanelContent({
  classicalLabel,
  classicalIsError,
  stateLabel,
  b,
  step,
}: ContentProps) {
  return (
    <>
      {/* Cards */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {/* Classical bit card */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,77,106,0.08)",
            border: classicalIsError
              ? "1px solid #ff4d6a"
              : "1px solid rgba(255,77,106,0.25)",
            borderRadius: 8,
            padding: "8px 6px",
            textAlign: "center",
            animation: classicalIsError
              ? "classicalError 0.8s ease-in-out infinite"
              : "none",
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: "monospace",
              color: "#5a7a9a",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            CLASSICAL BIT
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "monospace",
              color: classicalIsError ? "#ff4d6a" : "#aaaaaa",
              lineHeight: 1.1,
            }}
          >
            {classicalLabel}
          </div>
          {classicalIsError && (
            <div
              style={{
                fontSize: 8,
                color: "#ff4d6a",
                fontFamily: "monospace",
                marginTop: 3,
              }}
            >
              Cannot be both!
            </div>
          )}
        </div>

        {/* Qubit card */}
        <div
          style={{
            flex: 1,
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: 8,
            padding: "8px 6px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 8,
              fontFamily: "monospace",
              color: "#5a7a9a",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            YOU — QUBIT
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "monospace",
              color: b.isSuperposition
                ? "#a855f7"
                : b.p0 > 0.95
                  ? "#4de8ff"
                  : "#ff4d6a",
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {stateLabel}
          </div>
          {/* Probability bar */}
          <div style={{ marginBottom: 2 }}>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: "#0a1628",
                overflow: "hidden",
                display: "flex",
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
          {b.isSuperposition && (
            <div
              style={{
                fontSize: 9,
                color: "#a855f7",
                fontFamily: "monospace",
                fontWeight: 700,
                textShadow: "0 0 8px #a855f7",
              }}
            >
              BOTH!
            </div>
          )}
        </div>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STEPS.map((s, i) => {
          const isCurrent = i === step;
          const isDone = i < step;
          return (
            <div
              key={s.label}
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                border: isCurrent
                  ? "1px solid #4de8ff"
                  : isDone
                    ? "1px solid rgba(77,232,255,0.2)"
                    : "1px solid transparent",
                background: isCurrent
                  ? "rgba(77,232,255,0.08)"
                  : "transparent",
                boxShadow: isCurrent ? "0 0 8px rgba(77,232,255,0.2)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isDone && (
                <span style={{ color: "#4de8ff", fontSize: 10 }}>✓</span>
              )}
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: isCurrent ? "#4de8ff" : isDone ? "#4de8ff88" : "#3a4a5a",
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
