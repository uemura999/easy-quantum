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

export type GamePhase = "title" | "playing" | "complete";
export type Stage = "prologue" | "awakening" | "doubleSlit" | "complete";

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface XpGain {
  id: number;
  amount: number;
}

export type GateKey = "H" | "X" | "Z";
