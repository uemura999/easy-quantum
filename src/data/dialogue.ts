import type { DialogueLine } from "../types";

export const GUIDE_PORTRAIT = "🧒";

export const PROLOGUE: DialogueLine[] = [
  { speaker: "Chen", text: "Hey, over here! I'm Chen — your guide in this world." },
  { speaker: "Chen", text: "The world you're about to explore is nothing like the one we usually live in." },
  { speaker: "Chen", text: "Here you can't \"walk\" or \"run.\" You can't \"turn right\" either." },
  { speaker: "Chen", text: "Why? Because in this world, the idea of \"place\" doesn't really exist." },
  { speaker: "Chen", text: "You're not human here. You become a glowing ripple — a \"wave packet.\"" },
  { speaker: "Chen", text: "A wave packet is like the ripple when you throw a stone into water.\nThe brighter the spot, the higher the probability that \"you\" are there." },
  { speaker: "Chen", text: "See the colors? That's \"phase\" — like an internal clock that shapes where you go." },
  { speaker: "Chen", text: "This world has only three rules:\n\n① You spread out naturally (diffusion)\n② You change phase to steer (interference)\n③ When \"observed,\" you collapse to a point (measurement)" },
  { speaker: "Chen", text: "Forget everyday intuition. Here, only the laws of quantum mechanics protect you." },
  { speaker: "Chen", text: "Ready? First, check your own state. The sphere in the top-right is your Status Panel." },
];

export const STAGE_DIALOGUE = {
  awakening: {
    intro: [
      { speaker: "Chen", text: "This is the \"Awakening Chamber\" — where you first wake as a wave packet." },
      { speaker: "Chen", text: "Right now you're a tiny point of light. Look at the Status Panel (the sphere).\nThe needle points to the very top (North Pole), right?" },
      { speaker: "Chen", text: "That means you're \"collapsed\" — stuck in one place. Kind of boring." },
      { speaker: "Chen", text: "💡 Try the **H skill**! Press the [H] key or the H button below." },
    ],
    onH: [
      { speaker: "Chen", text: "Whoa!! You just spread out like a ripple!!" },
      { speaker: "Chen", text: "See the needle on the panel move to the equator?\nThat's \"superposition\" — you're in many places at once." },
      { speaker: "Chen", text: "This spread-out state is the strongest form here. You might even slip through walls." },
    ],
    onX: [
      { speaker: "Chen", text: "X skill! Top and bottom just flipped!" },
      { speaker: "Chen", text: "The needle jumped from North to South Pole. That's swapping \"high\" and \"low\" in an instant." },
    ],
    onZ: [
      { speaker: "Chen", text: "Z skill! The ripple's phase changed!" },
      { speaker: "Chen", text: "It might look almost the same, but the \"color\" (phase) has flipped." },
      { speaker: "Chen", text: "This is crucial. When waves meet, same phase amplifies; opposite phase cancels out." },
    ],
    onMeasure: [
      { speaker: "Chen", text: "Oops!! You just got **observed**!!" },
      { speaker: "Chen", text: "Look — your beautiful ripple collapsed into a tiny point in an instant." },
      { speaker: "Chen", text: "The scariest thing here is being seen. The moment you're observed, you're squeezed into a single point." },
      { speaker: "Chen", text: "That's called \"wave function collapse\" — but just remember: **if you're seen, you shrink**." },
    ],
  },
  doubleSlit: {
    intro: [
      { speaker: "Chen", text: "Welcome to Stage 2 — the **Double Slit Wall**. You'll experience the famous experiment yourself." },
      { speaker: "Chen", text: "Ahead you see a wall with two narrow slits. Beyond it is the \"Energy Spring\" — your goal." },
      { speaker: "Chen", text: "But be careful! Beyond the wall there's a **Death Zone** and a **Spring Zone**. Walking straight through can pull you into the death zone!" },
      { speaker: "Chen", text: "How to clear it:\n① Use [H] to spread and pass through both slits at once\n② Before the waves merge, press [Z] to flip phase\n③ Waves cancel in the death zone and add up at the spring!" },
      { speaker: "Chen", text: "💡 When you're ready, press [H] to spread!" },
    ],
    onH: [
      { speaker: "Chen", text: "Nice! You're spreading. Your ripple is heading for both slits…" },
      { speaker: "Chen", text: "You're going through both slits at once! A classical particle could never do that." },
      { speaker: "Chen", text: "⚠️ Wait!! The brightest part of the merged wave is heading into the Death Zone!\nPress [Z] now to flip the phase!!" },
    ],
    onZ: [
      { speaker: "Chen", text: "Perfect!!! Phase flipped!!" },
      { speaker: "Chen", text: "Look!! The wave that was heading for the Death Zone…\nIt's meeting out-of-phase waves and canceling out!!" },
      { speaker: "Chen", text: "All the amplitude is piling up in the Spring Zone!! That's the power of **interference**!!" },
      { speaker: "Chen", text: "🎉 You did it!! Stage clear!!\n\nYou just used quantum interference with your own \"body.\" That's the same phenomenon scientists study — and you felt it." },
    ],
  },
} as const;
