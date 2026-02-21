import type { Complex, QuantumState, BlochState } from "../types";

const cx = (re: number, im = 0): Complex => ({ re, im });
const cAdd = (a: Complex, b: Complex): Complex => cx(a.re + b.re, a.im + b.im);
const cMul = (a: Complex, b: Complex): Complex =>
  cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cNorm = (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im);
const cPhase = (a: Complex): number => Math.atan2(a.im, a.re);
const S2 = 1 / Math.sqrt(2);

const GATE_DEFS: Record<string, { m: [[Complex, Complex], [Complex, Complex]] }> = {
  H: { m: [[cx(S2), cx(S2)], [cx(S2), cx(-S2)]] },
  X: { m: [[cx(0), cx(1)], [cx(1), cx(0)]] },
  Z: { m: [[cx(1), cx(0)], [cx(0), cx(-1)]] },
  Y: { m: [[cx(0), cx(0, -1)], [cx(0, 1), cx(0)]] },
  S: { m: [[cx(1), cx(0)], [cx(0), cx(0, 1)]] },
};

export function createState(zeroAmp: Complex, oneAmp: Complex): QuantumState {
  return [zeroAmp, oneAmp];
}

export function applyGate(state: QuantumState, gate: string): QuantumState {
  const def = GATE_DEFS[gate];
  if (!def) return state;
  const m = def.m;
  return [
    cAdd(cMul(m[0][0], state[0]), cMul(m[0][1], state[1])),
    cAdd(cMul(m[1][0], state[0]), cMul(m[1][1], state[1])),
  ];
}

export function bloch(state: QuantumState): BlochState {
  const theta = 2 * Math.acos(Math.min(1, cNorm(state[0])));
  let phi = 0;
  if (cNorm(state[1]) > 1e-9) phi = cPhase(state[1]) - cPhase(state[0]);
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
    p0: cNorm(state[0]) ** 2,
    p1: cNorm(state[1]) ** 2,
    theta,
    phi,
    isSuperposition: Math.abs(cNorm(state[0]) ** 2 - 0.5) < 0.2,
  };
}

export function measure(state: QuantumState): { result: 0 | 1; newState: QuantumState } {
  const p0 = cNorm(state[0]) ** 2;
  const result = Math.random() < p0 ? 0 : 1;
  return {
    result,
    newState: result === 0 ? [cx(1), cx(0)] : [cx(0), cx(1)],
  };
}

export const INITIAL_STATE: QuantumState = [cx(1), cx(0)];
