/** Complex number: { re, im } */
export interface Complex {
  re: number;
  im: number;
}

/** Single-qubit state: [|0⟩ amplitude, |1⟩ amplitude] */
export type QuantumState = [Complex, Complex];

/** Bloch sphere representation + probabilities */
export interface BlochState {
  x: number;
  y: number;
  z: number;
  p0: number;
  p1: number;
  theta: number;
  phi: number;
  isSuperposition: boolean;
}

export type GamePhase = "title" | "playing" | "quiz" | "complete";
export type Stage = "prologue" | "bitLesson" | "awakening" | "doubleSlit" | "complete";
export type LevelMode = "beginner" | "intermediate" | "advanced";

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface XpGain {
  id: number;
  amount: number;
}

export type GateKey = "H" | "X" | "Z";

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface QuizResult {
  questionIndex: number;
  selected: number;
  correct: boolean;
}

export interface Achievement {
  title: string;
  badge: string;
  description: string;
  minScore: number;
}
