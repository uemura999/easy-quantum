# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wave Packet Traveler is a quantum education RPG built with React, TypeScript, and Three.js. Players control a wave packet through quantum mechanics concepts like superposition, interference, and measurement using quantum gates (H, X, Z) and measurement operations.

## Common Commands

```bash
# Development
npm install
npm run dev              # Start development server at localhost:5173

# Build and deployment
npm run build           # TypeScript compile + Vite build
npm run preview         # Preview production build
```

## Architecture

### Core Systems

- **Quantum Engine** (`src/lib/quantumEngine.ts`): Complex number operations, quantum gate matrices (H, X, Z), Bloch sphere calculations, and measurement functions
- **Game State** (`src/App.tsx`): Central state management for game phases, quantum state, dialogue system, XP progression, and stage transitions
- **3D Visualization** (`src/components/QuantumWorld.tsx`): Three.js scene rendering quantum states and wave interference patterns

### State Flow

1. Game starts in title phase, progresses through prologue → awakening → doubleSlit → complete
2. Quantum state updates trigger Bloch sphere recalculation and visual updates
3. Gate operations (H/X/Z) and measurement (M) drive stage progression via dialogue triggers
4. XP system rewards gate usage and stage completion

### Key Types

- `QuantumState`: Tuple of complex amplitudes `[|0⟩, |1⟩]`
- `BlochState`: 3D coordinates plus probabilities and superposition flag
- `GamePhase`: "title" | "playing" | "complete"
- `Stage`: "prologue" | "awakening" | "doubleSlit" | "complete"

### Component Structure

All UI components are in `src/components/` with barrel export via `index.ts`. The dialogue system uses a queue-based approach with speaker/text pairs and callback completion handlers.