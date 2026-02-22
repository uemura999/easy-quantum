import { useState } from "react";
import { QUIZ } from "../data/quiz";
import { getAchievement } from "../data/achievements";
import type { LevelMode, QuizResult } from "../types";

interface QuizReviewScreenProps {
  mode: LevelMode;
  xp: number;
  results: QuizResult[];
  onRestart: () => void;
}

export function QuizReviewScreen({
  mode,
  xp,
  results,
  onRestart,
}: QuizReviewScreenProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const questions = QUIZ[mode] ?? QUIZ.beginner;
  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  const achievement = getAchievement(mode, score);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        overflowY: "auto",
        background: "rgba(2,8,16,0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          fontFamily: "monospace",
        }}
      >
        {/* Achievement badge */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
            animation: "panelSlideIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 8, lineHeight: 1 }}>
            {achievement.badge}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#4de8ff",
              marginBottom: 6,
              letterSpacing: 1,
            }}
          >
            {achievement.title}
          </div>
          <div style={{ fontSize: 13, color: "#8899bb", lineHeight: 1.5 }}>
            {achievement.description}
          </div>
        </div>

        {/* Score */}
        <div
          style={{
            background: "rgba(8,16,32,0.9)",
            border: "1px solid rgba(77,232,255,0.25)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{ fontSize: 10, color: "#5a7a9a", marginBottom: 4 }}
            >
              SCORE
            </div>
            <div
              style={{ fontSize: 28, fontWeight: 700, color: "#e0f0ff" }}
            >
              {score}{" "}
              <span style={{ fontSize: 16, color: "#5a7a9a" }}>/ {total}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{ fontSize: 10, color: "#5a7a9a", marginBottom: 4 }}
            >
              XP EARNED
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f59e0b",
              }}
            >
              ⚡ {xp}
            </div>
          </div>
        </div>

        {/* Review list */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10,
              color: "#5a7a9a",
              letterSpacing: 1.5,
              marginBottom: 10,
            }}
          >
            REVIEW
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {results.map((r, i) => {
              const q = questions[r.questionIndex];
              const isOpen = expandedIdx === i;
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(8,16,32,0.85)",
                    border: `1px solid ${r.correct ? "rgba(77,255,145,0.2)" : "rgba(255,77,106,0.2)"}`,
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIdx(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        color: r.correct ? "#4dff91" : "#ff4d6a",
                        flexShrink: 0,
                      }}
                    >
                      {r.correct ? "✓" : "✗"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#b0c8e0",
                        flex: 1,
                        lineHeight: 1.4,
                      }}
                    >
                      {q.question}
                    </span>
                    <span style={{ fontSize: 10, color: "#5a7a9a" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 14px 12px 14px",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Options review */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        {q.options.map((opt, oi) => {
                          const isCorrect = oi === q.correct;
                          const wasSelected = oi === r.selected;
                          let color = "#5a7a9a";
                          let prefix = "  ";
                          if (isCorrect) {
                            color = "#4dff91";
                            prefix = "✓ ";
                          } else if (wasSelected && !isCorrect) {
                            color = "#ff4d6a";
                            prefix = "✗ ";
                          }
                          return (
                            <div
                              key={oi}
                              style={{ fontSize: 11, color, fontFamily: "monospace" }}
                            >
                              {prefix}{opt}
                            </div>
                          );
                        })}
                      </div>
                      {/* Explanation */}
                      <div
                        style={{
                          fontSize: 11,
                          color: "#8899bb",
                          lineHeight: 1.5,
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.03)",
                          borderRadius: 6,
                        }}
                      >
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Restart button */}
        <button
          type="button"
          onClick={onRestart}
          style={{
            width: "100%",
            padding: "14px",
            background: "rgba(77,232,255,0.1)",
            border: "1px solid rgba(77,232,255,0.4)",
            borderRadius: 12,
            color: "#4de8ff",
            fontSize: 14,
            fontFamily: "monospace",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 1,
          }}
        >
          ↩ Play Again
        </button>
      </div>
    </div>
  );
}
