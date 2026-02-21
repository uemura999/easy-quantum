# Wave-Packet Traveler

A quantum edtech RPG built with React, TypeScript, and Three.js. You play as a wave packet in a world governed by quantum mechanics — spread (H), flip (X), shift phase (Z), and observe (M) to learn superposition, interference, and measurement.

## Project structure

```
wave-packet-traveler/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx           # Entry point
│   ├── App.tsx             # Game state and main layout
│   ├── types.ts            # Shared TypeScript types
│   ├── lib/
│   │   └── quantumEngine.ts  # Complex numbers, gates, Bloch, measure
│   ├── data/
│   │   └── dialogue.ts     # All in-game dialogue (English)
│   ├── components/
│   │   ├── QuantumWorld.tsx   # Three.js 3D scene
│   │   ├── DialogueBox.tsx
│   │   ├── StatusPanel.tsx
│   │   ├── SkillBar.tsx
│   │   ├── XpPopup.tsx
│   │   ├── CompletionScreen.tsx
│   │   ├── TitleScreen.tsx
│   │   ├── StageIndicator.tsx
│   │   └── index.ts
│   └── styles/
│       └── global.css
└── README.md
```

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # Preview production build
```

## Controls

- **[H]** — Hadamard (spread / superposition)
- **[X]** — Pauli-X (flip |0⟩↔|1⟩)
- **[Z]** — Pauli-Z (phase flip)
- **[M]** — Measure (collapse)
- **Click** dialogue or **Space/Enter** to advance text

All UI text and dialogue are in English. The game is suitable for delivery as a standalone web app.
>>>>>>> 7b4eaf4 (initial commit)
