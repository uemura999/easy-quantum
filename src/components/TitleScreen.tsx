interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        background:
          "radial-gradient(ellipse at 30% 40%, rgba(13,27,50,0.97), rgba(2,5,10,0.99))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: `rgba(77,232,255,${0.2 + Math.random() * 0.4})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatParticle ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div
          style={{
            fontSize: 14,
            color: "#4de8ff",
            fontFamily: "monospace",
            letterSpacing: 4,
            marginBottom: 16,
            opacity: 0.7,
          }}
        >
          QUANTUM EDTECH RPG
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 7vw, 56px)",
            fontWeight: 900,
            fontFamily: "'Space Grotesk', sans-serif",
            background:
              "linear-gradient(135deg, #4de8ff 0%, #a855f7 40%, #ff4d6a 70%, #f59e0b 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          Wave-Packet Traveler
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#5a7a9a",
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: 40,
            letterSpacing: 2,
          }}
        >
          Explore the quantum world as a wave packet
        </p>

        {/* Center the following "You are no longer 'human.'" message visually and structurally */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 40px auto",
            minHeight: 90,
          }}
        >
          <span
            style={{
              fontSize: 15,
              color: "#7a9ab8",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 8,
              fontWeight: 500,
              letterSpacing: 1,
              textAlign: "center",
              lineHeight: "1.8",
              display: "block",
              width: "100%",
            }}
          >
            You are no longer &quot;human.&quot;
          </span>
          <span
            style={{
              fontSize: 15,
              color: "#7a9ab8",
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 0,
              fontWeight: 500,
              letterSpacing: 1,
              textAlign: "center",
              lineHeight: "1.8",
              display: "block",
              width: "100%",
            }}
          >
            As a glowing wave packet,
            <br />
            adventure through a world ruled only by quantum laws.
          </span>
        </div>

        <button
          type="button"
          onClick={onStart}
          style={{
            padding: "16px 48px",
            borderRadius: 14,
            border: "2px solid rgba(77,232,255,0.5)",
            background:
              "linear-gradient(135deg, rgba(77,232,255,0.15), rgba(168,85,247,0.1))",
            color: "#4de8ff",
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: 2,
            boxShadow: "0 0 30px rgba(77,232,255,0.15)",
            transition: "all 0.3s",
          }}
        >
          Start Adventure
        </button>

        <div
          style={{
            marginTop: 20,
            fontSize: 11,
            color: "#3a5070",
            fontFamily: "monospace",
          }}
        >
          [H] [X] [Z] [M] keys or click buttons to play
        </div>
      </div>
    </div>
  );
}
