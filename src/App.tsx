import { useState, useCallback, useEffect } from "react";
import {
  applyGate,
  bloch,
  measure,
  INITIAL_STATE,
} from "./lib/quantumEngine";
import { PROLOGUE, STAGE_DIALOGUE } from "./data/dialogue";
import {
  QuantumWorld,
  DialogueBox,
  StatusPanel,
  SkillBar,
  XpPopup,
  CompletionScreen,
  TitleScreen,
  StageIndicator,
} from "./components";
import type { GamePhase, Stage, QuantumState, GateKey } from "./types";
import type { XpGain } from "./types";

declare global {
  interface Window {
    __dialogueComplete?: (() => void) | null;
  }
}

export default function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>("title");
  const [stage, setStage] = useState<Stage>("prologue");
  const [quantumState, setQuantumState] = useState<QuantumState>(INITIAL_STATE);
  const [waveExpanded, setWaveExpanded] = useState(false);
  const [collapseFlash, setCollapseFlash] = useState(0);
  const [xp, setXp] = useState(0);
  const [xpGains, setXpGains] = useState<XpGain[]>([]);

  const [dialogueQueue, setDialogueQueue] = useState<{ speaker: string; text: string }[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [unlockedGates, setUnlockedGates] = useState<GateKey[]>(["H"]);

  const [slitPhase, setSlitPhase] = useState(0);
  const [slitNeedsZ, setSlitNeedsZ] = useState(false);

  const gainXp = useCallback((amount: number) => {
    setXp((prev) => prev + amount);
    const id = Date.now() + Math.random();
    setXpGains((prev) => [...prev, { id, amount }]);
    setTimeout(
      () => setXpGains((prev) => prev.filter((g) => g.id !== id)),
      1500
    );
  }, []);

  const startDialogue = useCallback(
    (messages: { speaker: string; text: string }[], onComplete: () => void) => {
      setDialogueQueue(messages);
      setDialogueIndex(0);
      setShowDialogue(true);
      window.__dialogueComplete = onComplete;
    },
    []
  );

  const advanceDialogue = useCallback(() => {
    if (dialogueIndex < dialogueQueue.length - 1) {
      setDialogueIndex((i) => i + 1);
    } else {
      setShowDialogue(false);
      if (window.__dialogueComplete) {
        window.__dialogueComplete();
        window.__dialogueComplete = null;
      }
    }
  }, [dialogueIndex, dialogueQueue.length]);

  const startGame = useCallback(() => {
    setGamePhase("playing");
    setStage("prologue");
    setQuantumState(INITIAL_STATE);
    setWaveExpanded(false);
    setXp(0);
    setSlitPhase(0);
    setSlitNeedsZ(false);
    setUnlockedGates(["H"]);
    startDialogue(PROLOGUE, () => {
      setStage("awakening");
      startDialogue(STAGE_DIALOGUE.awakening.intro, () => {});
    });
  }, [startDialogue]);

  const handleGate = useCallback(
    (gate: GateKey) => {
      if (showDialogue) return;

      const newState = applyGate(quantumState, gate);
      setQuantumState(newState);

      const b = bloch(newState);
      setWaveExpanded(b.isSuperposition);

      gainXp(gate === "H" ? 15 : 10);

      if (stage === "awakening") {
        if (gate === "H" && STAGE_DIALOGUE.awakening.onH) {
          startDialogue(STAGE_DIALOGUE.awakening.onH, () => {
            setUnlockedGates(["H", "X", "Z"]);
          });
        } else if (gate === "X" && STAGE_DIALOGUE.awakening.onX) {
          startDialogue(STAGE_DIALOGUE.awakening.onX, () => {});
        } else if (gate === "Z" && STAGE_DIALOGUE.awakening.onZ) {
          startDialogue(STAGE_DIALOGUE.awakening.onZ, () => {
            setTimeout(() => {
              setStage("doubleSlit");
              setQuantumState(INITIAL_STATE);
              setWaveExpanded(false);
              setSlitPhase(0);
              setSlitNeedsZ(false);
              gainXp(50);
              startDialogue(STAGE_DIALOGUE.doubleSlit.intro, () => {});
            }, 500);
          });
        }
      } else if (stage === "doubleSlit") {
        if (gate === "H" && !slitNeedsZ) {
          setWaveExpanded(true);
          setSlitPhase(0.5);
          startDialogue(STAGE_DIALOGUE.doubleSlit.onH, () => {
            setSlitNeedsZ(true);
            setSlitPhase(0.7);
          });
        } else if (gate === "Z" && slitNeedsZ) {
          setSlitPhase(1.0);
          gainXp(100);
          startDialogue(STAGE_DIALOGUE.doubleSlit.onZ, () => {
            gainXp(200);
            setGamePhase("complete");
          });
        }
      }
    },
    [
      quantumState,
      stage,
      showDialogue,
      slitNeedsZ,
      gainXp,
      startDialogue,
    ]
  );

  const handleMeasure = useCallback(() => {
    if (showDialogue) return;
    const { newState } = measure(quantumState);
    setQuantumState(newState);
    setWaveExpanded(false);
    setCollapseFlash((f) => f + 1);
    setTimeout(() => setCollapseFlash(0), 800);

    if (stage === "awakening") {
      startDialogue(STAGE_DIALOGUE.awakening.onMeasure, () => {});
    }
    gainXp(5);
  }, [quantumState, stage, showDialogue, gainXp, startDialogue]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gamePhase === "title") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (gamePhase !== "playing") return;
      const key = e.key.toUpperCase();
      if (key === "H" || key === "X" || key === "Z") {
        if (unlockedGates.includes(key as GateKey)) handleGate(key as GateKey);
      }
      if (key === "M") handleMeasure();
      if (key === " " || key === "ENTER") {
        e.preventDefault();
        if (showDialogue) advanceDialogue();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    gamePhase,
    handleGate,
    handleMeasure,
    advanceDialogue,
    showDialogue,
    unlockedGates,
    startGame,
  ]);

  const handleRestart = useCallback(() => {
    setGamePhase("title");
    setQuantumState(INITIAL_STATE);
    setWaveExpanded(false);
    setXp(0);
    setSlitPhase(0);
    setSlitNeedsZ(false);
    setCollapseFlash(0);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#020810",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <QuantumWorld
        quantumState={quantumState}
        stage={stage}
        waveExpanded={waveExpanded}
        collapseFlash={collapseFlash}
        slitPhase={slitPhase}
      />

      {gamePhase === "title" && <TitleScreen onStart={startGame} />}

      {gamePhase === "playing" && (
        <>
          <StatusPanel quantumState={quantumState} xp={xp} stage={stage} />
          <SkillBar
            onGate={handleGate}
            onMeasure={handleMeasure}
            unlockedGates={unlockedGates}
            stage={stage}
          />
          <DialogueBox
            messages={dialogueQueue}
            currentIndex={dialogueIndex}
            onAdvance={advanceDialogue}
            visible={showDialogue}
          />
          <XpPopup xpGains={xpGains} />
          <StageIndicator stage={stage} />
        </>
      )}

      {gamePhase === "complete" && (
        <CompletionScreen xp={xp} onRestart={handleRestart} />
      )}
    </div>
  );
}
