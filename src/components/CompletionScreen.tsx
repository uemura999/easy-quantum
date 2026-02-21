interface CompletionScreenProps {
  xp: number;
  onRestart: () => void;
}

export function CompletionScreen({ xp, onRestart }: CompletionScreenProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        background:
          "radial-gradient(ellipse at center, rgba(8,16,32,0.9), rgba(2,5,10,0.95))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 1s ease",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎊</div>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#ffd700",
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: 8,
          textShadow: "0 0 20px rgba(255,215,0,0.3)",
        }}
      >
        Adventure Complete!
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "#b8cce0",
          marginBottom: 6,
          textAlign: "center",
          lineHeight: 1.8,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        You survived the quantum world and learned
        <br />
        &quot;diffusion,&quot; &quot;interference,&quot; and &quot;phase control&quot; by experience.
      </p>
      <p
        style={{
          fontSize: 13,
          color: "#5a7a9a",
          marginBottom: 20,
          fontFamily: "monospace",
        }}
      >
        Total XP: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{xp}</span>
      </p>
      <div
        style={{
          background: "rgba(77,232,255,0.08)",
          border: "1px solid rgba(77,232,255,0.25)",
          borderRadius: 12,
          padding: "16px 24px",
          maxWidth: 400,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#4de8ff",
            fontFamily: "monospace",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          🧒 From Chen
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#b8cce0",
            lineHeight: 1.8,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          &quot;Well done! You now understand the basics of quantum computing with
          your own intuition. Superposition, interference, measurement — this is
          the same physics researchers use worldwide. Your adventure is just
          beginning!&quot;
        </p>
      </div>
      <button
        type="button"
        onClick={onRestart}
        style={{
          padding: "12px 32px",
          borderRadius: 12,
          border: "1px solid rgba(77,232,255,0.4)",
          background:
            "linear-gradient(135deg, rgba(77,232,255,0.15), rgba(77,232,255,0.05))",
          color: "#4de8ff",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        Play Again
      </button>
    </div>
  );
}
