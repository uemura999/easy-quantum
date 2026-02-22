import { useState, useEffect } from "react";
import type { DialogueLine } from "../types";
import { GUIDE_PORTRAIT } from "../data/dialogue";

interface DialogueBoxProps {
  messages: DialogueLine[];
  currentIndex: number;
  onAdvance: () => void;
  visible: boolean;
  inline?: boolean;
}

export function DialogueBox({
  messages,
  currentIndex,
  onAdvance,
  visible,
  inline = false,
}: DialogueBoxProps) {
  const [charIndex, setCharIndex] = useState(0);
  const msg = messages[currentIndex];
  const fullText = msg?.text ?? "";
  const displayText = fullText.slice(0, charIndex);
  const isComplete = charIndex >= fullText.length;

  useEffect(() => {
    setCharIndex(0);
  }, [currentIndex, messages]);

  useEffect(() => {
    if (charIndex < fullText.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), 25);
      return () => clearTimeout(timer);
    }
  }, [charIndex, fullText.length]);

  const handleClick = () => {
    if (!isComplete) {
      setCharIndex(fullText.length);
    } else {
      onAdvance();
    }
  };

  if (!visible || !msg) return null;

  return (
    <div
      onClick={handleClick}
      style={inline ? {
        position: "relative",
        width: "100%",
        marginTop: 8,
        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",
      } : {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 700,
        margin: "0 auto",
        zIndex: 20,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(8,16,32,0.95), rgba(12,24,48,0.95))",
          border: "2px solid rgba(77,232,255,0.35)",
          borderRadius: 16,
          padding: "16px 20px",
          boxShadow:
            "0 0 30px rgba(77,232,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -14,
            left: 20,
            background: "linear-gradient(135deg, #0d2847, #0a1f3a)",
            border: "1px solid rgba(77,232,255,0.4)",
            borderRadius: 8,
            padding: "3px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 16 }}>{GUIDE_PORTRAIT}</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4de8ff",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: 1,
            }}
          >
            {msg.speaker}
          </span>
        </div>
        <div
          style={{
            fontSize: 14.5,
            lineHeight: 1.85,
            color: "#d8e8f4",
            fontFamily: "'Space Grotesk', sans-serif",
            marginTop: 6,
            minHeight: 60,
            whiteSpace: "pre-wrap",
          }}
        >
          {displayText.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i}>{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
          {!isComplete && (
            <span
              style={{
                animation: "blink 0.5s infinite",
                color: "#4de8ff",
              }}
            >
              ▌
            </span>
          )}
        </div>
        {isComplete && (
          <div
            style={{
              textAlign: "right",
              fontSize: 11,
              color: "#4de8ff",
              fontFamily: "monospace",
              opacity: 0.7,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          >
            ▼ Click to continue
          </div>
        )}
      </div>
    </div>
  );
}
