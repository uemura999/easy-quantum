import type { Achievement } from "../types";

export const ACHIEVEMENTS: Record<string, Achievement[]> = {
  beginner: [
    {
      minScore: 4,
      badge: "⚛️",
      title: "Quantum Thinker",
      description: "Perfect! You've mastered the basics of quantum computing!",
    },
    {
      minScore: 3,
      badge: "🌊",
      title: "Wave Rider",
      description: "Great job! You're riding the wave of quantum understanding.",
    },
    {
      minScore: 2,
      badge: "💡",
      title: "Curious Learner",
      description: "Good start! Keep exploring the quantum world.",
    },
    {
      minScore: 0,
      badge: "🔍",
      title: "Explorer",
      description: "Every quantum journey starts with curiosity!",
    },
  ],
  intermediate: [
    {
      minScore: 4,
      badge: "🔮",
      title: "Gate Master",
      description: "Perfect! You've mastered quantum gates and superposition!",
    },
    {
      minScore: 3,
      badge: "⚡",
      title: "Phase Bender",
      description: "Excellent! You bent the phase of quantum reality.",
    },
    {
      minScore: 2,
      badge: "🌌",
      title: "Wave Packet",
      description: "Good! You're becoming a true quantum wave packet.",
    },
    {
      minScore: 0,
      badge: "🎯",
      title: "State Seeker",
      description: "Keep seeking the quantum truth!",
    },
  ],
  advanced: [
    {
      minScore: 4,
      badge: "🏆",
      title: "Quantum Physicist",
      description: "Perfect! You mastered interference like a real physicist!",
    },
    {
      minScore: 3,
      badge: "✨",
      title: "Interference Pro",
      description: "Great! You mastered the art of quantum interference.",
    },
    {
      minScore: 2,
      badge: "🔬",
      title: "Lab Explorer",
      description: "Good! You're exploring quantum phenomena.",
    },
    {
      minScore: 0,
      badge: "📚",
      title: "Quantum Learner",
      description: "Keep learning the mysteries of quantum mechanics!",
    },
  ],
};

export function getAchievement(mode: string, score: number): Achievement {
  const list = ACHIEVEMENTS[mode] ?? ACHIEVEMENTS.beginner;
  return list.find((a) => score >= a.minScore) ?? list[list.length - 1];
}
