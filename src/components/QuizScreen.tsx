import { useState } from "react";
import { QUIZ } from "../data/quiz";
import type { LevelMode, QuizResult } from "../types";

interface QuizScreenProps {
  mode: LevelMode;
  onComplete: (results: QuizResult[]) => void;
}

export function QuizScreen({ mode, onComplete }: QuizScreenProps) {
  const questions = QUIZ[mode] ?? QUIZ.beginner;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);

  const q = questions[current];
  const total = questions.length;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);

    const isCorrect = idx === q.correct;
    const newResults = [
      ...results,
      { questionIndex: current, selected: idx, correct: isCorrect },
    ];
    setResults(newResults);

    setTimeout(() => {
      if (current < total - 1) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        onComplete(newResults);
      }
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2,8,16,0.92)",
        backdropFilter: "blur(12px)",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "min(480px, 100%)",
          background: "rgba(8,16,32,0.95)",
          border: "1px solid rgba(77,232,255,0.3)",
          borderRadius: 16,
          padding: "24px",
          fontFamily: "monospace",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 10, color: "#4de8ff", letterSpacing: 2 }}>
            KNOWLEDGE CHECK
          </span>
          <span style={{ fontSize: 10, color: "#5a7a9a" }}>
            Question {current + 1} of {total}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((current) / total) * 100}%`,
              background: "#4de8ff",
              transition: "width 0.5s ease",
              borderRadius: 2,
            }}
          />
        </div>

        {/* Question */}
        <div
          style={{
            fontSize: 15,
            color: "#e0f0ff",
            lineHeight: 1.5,
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          {q.question}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, idx) => {
            let borderColor = "rgba(77,232,255,0.15)";
            let bg = "rgba(77,232,255,0.04)";
            let color = "#8899bb";

            if (selected !== null) {
              if (idx === q.correct) {
                borderColor = "#4dff91";
                bg = "rgba(77,255,145,0.12)";
                color = "#4dff91";
              } else if (idx === selected && !q.options[idx].startsWith("")) {
                // wrong selection
                if (idx !== q.correct) {
                  borderColor = "#ff4d6a";
                  bg = "rgba(255,77,106,0.1)";
                  color = "#ff4d6a";
                }
              }
            } else if (selected === idx) {
              borderColor = "#4de8ff";
              bg = "rgba(77,232,255,0.1)";
              color = "#4de8ff";
            }

            // Override for selected wrong answer
            if (selected !== null && idx === selected && idx !== q.correct) {
              borderColor = "#ff4d6a";
              bg = "rgba(255,77,106,0.1)";
              color = "#ff4d6a";
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                style={{
                  padding: "12px 14px",
                  background: bg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 10,
                  color,
                  fontSize: 13,
                  fontFamily: "monospace",
                  textAlign: "left",
                  cursor: selected !== null ? "default" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `1px solid ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    flexShrink: 0,
                    color: borderColor,
                  }}
                >
                  {selected !== null && idx === q.correct
                    ? "✓"
                    : selected !== null && idx === selected && idx !== q.correct
                      ? "✗"
                      : String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation after answer */}
        {selected !== null && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              background:
                selected === q.correct
                  ? "rgba(77,255,145,0.08)"
                  : "rgba(255,77,106,0.08)",
              border: `1px solid ${selected === q.correct ? "rgba(77,255,145,0.3)" : "rgba(255,77,106,0.3)"}`,
              borderRadius: 8,
              fontSize: 12,
              color: "#b0c8e0",
              lineHeight: 1.5,
              animation: "panelSlideIn 0.3s ease both",
            }}
          >
            <span
              style={{
                color: selected === q.correct ? "#4dff91" : "#ff4d6a",
                fontWeight: 700,
                marginRight: 6,
              }}
            >
              {selected === q.correct ? "✓ Correct!" : "✗ Not quite."}
            </span>
            {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
