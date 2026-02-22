import { useState, useCallback, useEffect } from "react";
import {
  applyGate,
  bloch,
  measure,
  INITIAL_STATE,
} from "./lib/quantumEngine";
import {
  PROLOGUE,
  STAGE_DIALOGUE,
  BEGINNER_PROLOGUE,
  BEGINNER_STAGE_DIALOGUE,
  ADVANCED_PROLOGUE,
} from "./data/dialogue";
import {
  QuantumWorld,
  DialogueBox,
  StatusPanel,
  SkillBar,
  XpPopup,
  TitleScreen,
  StageIndicator,
  BlochFocusOverlay,
  BitComparePanel,
  GateHintOverlay,
  StageProgress,
  QuizScreen,
  QuizReviewScreen,
} from "./components";
import type { GamePhase, Stage, QuantumState, GateKey, LevelMode, QuizResult } from "./types";
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
  const [levelMode, setLevelMode] = useState<LevelMode>("intermediate");

  const [dialogueQueue, setDialogueQueue] = useState<{ speaker: string; text: string }[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const [unlockedGates, setUnlockedGates] = useState<GateKey[]>(["H"]);

  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [slitPhase, setSlitPhase] = useState(0);
  const [slitNeedsZ, setSlitNeedsZ] = useState(false);
  const [gateFlash, setGateFlash] = useState<{ gate: string; id: number } | null>(null);

  const [hintGate, setHintGate] = useState<GateKey | "M" | null>(null);
  const [sphereSpotlight, setSphereSpotlight] = useState(false);
  const [bitLessonStep, setBitLessonStep] = useState<0 | 1 | 2 | 3>(0);
  const [stageStep, setStageStep] = useState(0);

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
    (messages: readonly { speaker: string; text: string }[], onComplete: () => void) => {
      setDialogueQueue([...messages]);
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

  const startGame = useCallback(
    (mode: LevelMode) => {
      setLevelMode(mode);
      setGamePhase("playing");
      setQuantumState(INITIAL_STATE);
      setWaveExpanded(false);
      setXp(0);
      setSlitPhase(0);
      setSlitNeedsZ(false);
      setCollapseFlash(0);

      if (mode === "beginner") {
        setStage("prologue");
        setUnlockedGates(["H"]);
        startDialogue(BEGINNER_PROLOGUE, () => {
          setStage("bitLesson");
          setSphereSpotlight(true);
          startDialogue(BEGINNER_STAGE_DIALOGUE.bitLesson.intro, () => {
            setSphereSpotlight(false);
            setHintGate("H");
          });
        });
      } else if (mode === "intermediate") {
        setStage("prologue");
        setUnlockedGates(["H"]);
        startDialogue(PROLOGUE, () => {
          setStage("awakening");
          startDialogue(STAGE_DIALOGUE.awakening.intro, () => {
            setHintGate("H");
            setStageStep(0);
          });
        });
      } else {
        // advanced
        setStage("prologue");
        setUnlockedGates(["H", "X", "Z"]);
        startDialogue(ADVANCED_PROLOGUE, () => {
          setStage("doubleSlit");
          setQuantumState(INITIAL_STATE);
          startDialogue(STAGE_DIALOGUE.doubleSlit.intro, () => {
            setHintGate("H");
            setStageStep(0);
          });
        });
      }
    },
    [startDialogue]
  );

  const handleGate = useCallback(
    (gate: GateKey) => {
      if (showDialogue) return;

      const newState = applyGate(quantumState, gate);
      setQuantumState(newState);

      const b = bloch(newState);
      setWaveExpanded(b.isSuperposition);

      gainXp(gate === "H" ? 15 : 10);
      setGateFlash({ gate, id: Date.now() });

      if (stage === "bitLesson") {
        if (gate === "H") {
          setHintGate(null);
          setBitLessonStep(1);
          startDialogue(BEGINNER_STAGE_DIALOGUE.bitLesson.onH, () => {
            setHintGate("M");
            setSphereSpotlight(true);
            setBitLessonStep(2);
          });
        }
        // X/Z are not unlocked in beginner mode, so they won't be callable
      } else if (stage === "awakening") {
        if (gate === "H" && STAGE_DIALOGUE.awakening.onH) {
          setHintGate(null);
          setStageStep(1);
          startDialogue(STAGE_DIALOGUE.awakening.onH, () => {
            setUnlockedGates(["H", "X", "Z"]);
            setHintGate("Z");
            setStageStep(2);
          });
        } else if (gate === "X" && STAGE_DIALOGUE.awakening.onX) {
          startDialogue(STAGE_DIALOGUE.awakening.onX, () => {});
        } else if (gate === "Z" && STAGE_DIALOGUE.awakening.onZ) {
          setHintGate(null);
          setStageStep(3);
          startDialogue(STAGE_DIALOGUE.awakening.onZ, () => {
            if (levelMode === "intermediate") {
              gainXp(50);
              setGamePhase("quiz");
            } else {
              setTimeout(() => {
                setStage("doubleSlit");
                setQuantumState(INITIAL_STATE);
                setWaveExpanded(false);
                setSlitPhase(0);
                setSlitNeedsZ(false);
                gainXp(50);
                startDialogue(STAGE_DIALOGUE.doubleSlit.intro, () => {
                  setHintGate("H");
                  setStageStep(0);
                });
              }, 500);
            }
          });
        }
      } else if (stage === "doubleSlit") {
        if (gate === "H" && !slitNeedsZ) {
          setHintGate(null);
          setStageStep(1);
          setWaveExpanded(true);
          setSlitPhase(0.5);
          startDialogue(STAGE_DIALOGUE.doubleSlit.onH, () => {
            setSlitNeedsZ(true);
            setSlitPhase(0.7);
            setHintGate("Z");
            setStageStep(2);
          });
        } else if (gate === "Z" && slitNeedsZ) {
          setHintGate(null);
          setStageStep(3);
          setSlitPhase(1.0);
          gainXp(100);
          startDialogue(STAGE_DIALOGUE.doubleSlit.onZ, () => {
            gainXp(200);
            setGamePhase("quiz");
          });
        }
      }
    },
    [
      quantumState,
      stage,
      showDialogue,
      slitNeedsZ,
      levelMode,
      gainXp,
      startDialogue,
    ]
  );

  const handleMeasure = useCallback(() => {
    if (showDialogue) return;

    if (stage === "bitLesson") {
      const wasSuperposition = waveExpanded;
      const { newState } = measure(quantumState);
      setQuantumState(newState);
      setWaveExpanded(false);
      setCollapseFlash((f) => f + 1);
      setTimeout(() => setCollapseFlash(0), 800);

      if (wasSuperposition) {
        setHintGate(null);
        setSphereSpotlight(false);
        setBitLessonStep(3);
        startDialogue(BEGINNER_STAGE_DIALOGUE.bitLesson.onMeasure, () => {
          gainXp(50);
          setGamePhase("quiz");
        });
      } else {
        setHintGate("H");
        startDialogue(BEGINNER_STAGE_DIALOGUE.bitLesson.onMeasureCollapsed, () => {});
      }
      gainXp(5);
      return;
    }

    const { newState } = measure(quantumState);
    setQuantumState(newState);
    setWaveExpanded(false);
    setCollapseFlash((f) => f + 1);
    setTimeout(() => setCollapseFlash(0), 800);

    if (stage === "awakening") {
      startDialogue(STAGE_DIALOGUE.awakening.onMeasure, () => {});
    }
    gainXp(5);
  }, [quantumState, stage, waveExpanded, showDialogue, gainXp, startDialogue]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gamePhase === "title") {
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
  ]);

  const handleRestart = useCallback(() => {
    setGamePhase("title");
    setLevelMode("intermediate");
    setQuantumState(INITIAL_STATE);
    setWaveExpanded(false);
    setXp(0);
    setSlitPhase(0);
    setSlitNeedsZ(false);
    setCollapseFlash(0);
    setHintGate(null);
    setSphereSpotlight(false);
    setBitLessonStep(0);
    setStageStep(0);
    setQuizResults([]);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
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
        gateFlash={gateFlash}
        cameraFocusBloch={sphereSpotlight}
      />

      {gamePhase === "title" && <TitleScreen onStart={startGame} />}

      {gamePhase === "playing" && (
        <>
          <BlochFocusOverlay
            active={sphereSpotlight}
            quantumState={quantumState}
            onDismiss={() => setSphereSpotlight(false)}
            stage={stage}
          />
          {stage === "bitLesson" && (
            <BitComparePanel quantumState={quantumState} step={bitLessonStep} />
          )}
          {(stage === "awakening" || stage === "doubleSlit") && (
            <StageProgress stage={stage} step={stageStep} />
          )}
          <GateHintOverlay hintGate={hintGate} />
          <StatusPanel
            quantumState={quantumState}
            xp={xp}
            stage={stage}
            spotlight={sphereSpotlight}
          />
          <SkillBar
            onGate={handleGate}
            onMeasure={handleMeasure}
            unlockedGates={unlockedGates}
            stage={stage}
            hintGate={hintGate}
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

      {gamePhase === "quiz" && (
        <QuizScreen
          mode={levelMode}
          onComplete={(results) => {
            setQuizResults(results);
            setGamePhase("complete");
          }}
        />
      )}

      {gamePhase === "complete" && (
        <QuizReviewScreen
          mode={levelMode}
          xp={xp}
          results={quizResults}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
