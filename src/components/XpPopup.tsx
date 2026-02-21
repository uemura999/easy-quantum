import type { XpGain } from "../types";

interface XpPopupProps {
  xpGains: XpGain[];
}

export function XpPopup({ xpGains }: XpPopupProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      {xpGains.map((g) => (
        <div
          key={g.id}
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: "#f59e0b",
            fontFamily: "monospace",
            textShadow: "0 0 12px rgba(245,158,11,0.5)",
            animation: "floatUp 1.5s ease-out forwards",
            opacity: 0,
          }}
        >
          +{g.amount} XP
        </div>
      ))}
    </div>
  );
}
