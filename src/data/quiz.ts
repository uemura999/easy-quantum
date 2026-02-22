import type { QuizQuestion } from "../types";

export const QUIZ: Record<string, QuizQuestion[]> = {
  beginner: [
    {
      question: "A qubit is different from a regular bit because...",
      options: [
        "It's faster",
        "It can be 0 AND 1 at the same time",
        "It uses light",
        "It never changes",
      ],
      correct: 1,
      explanation:
        "A qubit can exist in superposition — both 0 AND 1 simultaneously — until it's measured.",
    },
    {
      question: "What does 'superposition' mean?",
      options: [
        "Adding numbers",
        "Being in two states at once",
        "Only 0, never 1",
        "A type of computer",
      ],
      correct: 1,
      explanation:
        "Superposition means existing in multiple states simultaneously — like a coin spinning in the air, both heads AND tails until it lands.",
    },
    {
      question: "What happened when you pressed [M] (Observe)?",
      options: [
        "Nothing",
        "The qubit multiplied",
        "It collapsed to either 0 or 1",
        "It disappeared",
      ],
      correct: 2,
      explanation:
        "Observation causes 'wave function collapse' — the qubit randomly chooses one definite value (0 or 1).",
    },
    {
      question: "What does the H gate do?",
      options: [
        "Delete your state",
        "Put you in superposition (both 0 and 1)",
        "Make you invisible",
        "Change gravity",
      ],
      correct: 1,
      explanation:
        "The Hadamard (H) gate puts a qubit into equal superposition — 50% chance of being 0 and 50% chance of being 1.",
    },
  ],
  intermediate: [
    {
      question: "On the Bloch sphere, where is 'superposition'?",
      options: [
        "North pole",
        "South pole",
        "The equator",
        "Inside the sphere",
      ],
      correct: 2,
      explanation:
        "The equator of the Bloch sphere represents superposition — halfway between the north pole (State 0) and south pole (State 1).",
    },
    {
      question: "What does the Z gate change?",
      options: [
        "The qubit's energy",
        "The qubit's phase",
        "The qubit's temperature",
        "Nothing at all",
      ],
      correct: 1,
      explanation:
        "The Z gate flips the quantum phase. The probabilities stay the same, but the internal 'direction' changes — crucial for quantum interference.",
    },
    {
      question: "'Wave function collapse' means...",
      options: [
        "A broken wave",
        "Observation snaps the state to a definite value",
        "A programming error",
        "Gravity on waves",
      ],
      correct: 1,
      explanation:
        "When you observe a quantum system, the superposition ends instantly and the system settles into one definite state.",
    },
    {
      question: "What does 'phase' control in quantum mechanics?",
      options: [
        "The color of light",
        "How waves interfere — amplify or cancel",
        "The qubit's temperature",
        "The speed of sound",
      ],
      correct: 1,
      explanation:
        "Phase determines interference: waves with the same phase amplify each other; waves with opposite phase cancel each other out.",
    },
  ],
  advanced: [
    {
      question: "How did you pass through BOTH slits at once?",
      options: [
        "You teleported",
        "H gate put you in superposition",
        "You went very fast",
        "The wall moved",
      ],
      correct: 1,
      explanation:
        "The H gate created superposition — your quantum wave spread and passed through both slits simultaneously, just like in the real double-slit experiment.",
    },
    {
      question: "Why did waves CANCEL in the Death Zone?",
      options: [
        "Bad luck",
        "Z gate flipped phase → destructive interference",
        "The zone is too cold",
        "Too many particles",
      ],
      correct: 1,
      explanation:
        "The Z gate flipped the phase of part of your wave. When opposite-phase waves met, they destructively interfered — canceling each other out.",
    },
    {
      question: "Why did waves ADD UP in the Energy Spring?",
      options: [
        "Random chance",
        "Same-phase waves constructively interfered",
        "The spring magnet",
        "Gravity helped",
      ],
      correct: 1,
      explanation:
        "Waves with the same phase reinforce each other through constructive interference — all the amplitude piled up at the Energy Spring.",
    },
    {
      question: "What makes quantum computers powerful?",
      options: [
        "They're just faster CPUs",
        "Superposition + interference enables exploring many paths at once",
        "They use special materials",
        "Quantum magic",
      ],
      correct: 1,
      explanation:
        "Qubits in superposition explore multiple possibilities simultaneously, and interference amplifies correct answers while canceling wrong ones.",
    },
  ],
};
