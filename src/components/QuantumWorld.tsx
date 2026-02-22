import { useRef, useEffect } from "react";
import * as THREE from "three";
import { bloch } from "../lib/quantumEngine";
import type { QuantumState, Stage } from "../types";

const GROUND_VERTEX = `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uExpanded;
  uniform vec2 uWaveCenter;
  void main(){
    vUv = uv;
    vec3 p = position;
    float dist = length(p.xy - uWaveCenter);
    float wave = sin(dist * 2.0 - uTime * 3.0) * 0.3 * uExpanded * exp(-dist * 0.06);
    p.z += wave;
    vPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const GROUND_FRAGMENT = `
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float uTime;
  uniform float uExpanded;
  uniform float uPhaseFlip;
  uniform float uCollapse;
  uniform vec2 uWaveCenter;
  void main(){
    float dist = length(vPos.xy - uWaveCenter);
    vec2 grid = abs(fract(vPos.xy * 0.5) - 0.5);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - smoothstep(0.0, 0.04, line);
    float ripple = sin(dist * 3.0 - uTime * 4.0) * 0.5 + 0.5;
    float amplitude = exp(-dist * (0.3 - uExpanded * 0.25)) * uExpanded;
    float phase = atan(vPos.y - uWaveCenter.y, vPos.x - uWaveCenter.x);
    float phaseColor = sin(phase + uTime + uPhaseFlip * 3.14159) * 0.5 + 0.5;
    vec3 col1 = vec3(0.3, 0.9, 1.0);
    vec3 col2 = vec3(0.66, 0.33, 0.97);
    vec3 col3 = vec3(1.0, 0.3, 0.4);
    vec3 waveColor = mix(col1, mix(col2, col3, phaseColor), phaseColor);
    vec3 gridColor = vec3(0.1, 0.3, 0.5);
    float collapseRing = smoothstep(0.0, 0.3, abs(dist - uCollapse * 20.0));
    float collapseFlash = (1.0 - collapseRing) * uCollapse * 2.0;
    vec3 finalColor = gridColor * gridAlpha * 0.15 + waveColor * amplitude * ripple * 0.6;
    finalColor += vec3(1.0, 0.85, 0.4) * collapseFlash;
    float alpha = gridAlpha * 0.12 + amplitude * ripple * 0.5 + collapseFlash * 0.5;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface QuantumWorldProps {
  quantumState: QuantumState;
  stage: Stage;
  waveExpanded: boolean;
  collapseFlash: number;
  slitPhase: number;
  gateFlash: { gate: string; id: number } | null;
  cameraFocusBloch?: boolean;
}

interface SceneRef {
  animId?: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  gridMat: THREE.ShaderMaterial;
  particles: THREE.Points;
  pGeo: THREE.BufferGeometry;
  pPositions: Float32Array;
  pColors: Float32Array;
  pPhases: Float32Array;
  pSizes: Float32Array;
  pCount: number;
  coreGlow: THREE.Mesh;
  arrowGroup: THREE.Group;
  wallGroup: THREE.Group;
  blochInnerGlow: THREE.Mesh;
  blochWire: THREE.Mesh;
  northHalo: THREE.Mesh;
  southHalo: THREE.Mesh;
  eqHalo: THREE.Mesh;
}

function makeTextSprite(text: string, pos: [number, number, number], color: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "bold 28px monospace";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, 128, 40);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.position.set(...pos);
  sprite.scale.set(3, 0.75, 1);
  return sprite;
}

export function QuantumWorld({
  quantumState,
  stage,
  waveExpanded,
  collapseFlash,
  slitPhase,
  gateFlash,
  cameraFocusBloch,
}: QuantumWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Partial<SceneRef>>({});
  const cameraFocusRef = useRef(false);
  const stateRef = useRef({
    quantumState,
    stage,
    waveExpanded,
    collapseFlash,
    slitPhase,
    gateFlash,
  });

  useEffect(() => {
    stateRef.current = { quantumState, stage, waveExpanded, collapseFlash, slitPhase, gateFlash };
  });

  useEffect(() => {
    cameraFocusRef.current = cameraFocusBloch ?? false;
  }, [cameraFocusBloch]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const isMobileDevice = window.innerWidth < 768;
    const bGroupInitX = isMobileDevice ? -4.0 : 7;
    const bGroupInitY = isMobileDevice ? 2.0 : 6;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020810, 0.015);
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
    camera.position.set(0, 8, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020810);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x1a2a4a, 0.4);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x4de8ff, 0.3);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);
    const pointLight1 = new THREE.PointLight(0x4de8ff, 0.8, 40);
    pointLight1.position.set(-5, 5, -5);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xa855f7, 0.5, 30);
    pointLight2.position.set(5, 3, 5);
    scene.add(pointLight2);

    const gridSize = 80;
    const gridGeo = new THREE.PlaneGeometry(gridSize, gridSize, 80, 80);
    const gridMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uWaveCenter: { value: new THREE.Vector2(0, 0) },
        uExpanded: { value: 0 },
        uPhaseFlip: { value: 0 },
        uCollapse: { value: 0 },
      },
      vertexShader: GROUND_VERTEX,
      fragmentShader: GROUND_FRAGMENT,
    });
    const ground = new THREE.Mesh(gridGeo, gridMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pCount = 2000;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    const pPhases = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = 0;
      pPositions[i * 3 + 1] = 0.1;
      pPositions[i * 3 + 2] = 0;
      pColors[i * 3] = 0.3;
      pColors[i * 3 + 1] = 0.9;
      pColors[i * 3 + 2] = 1.0;
      pSizes[i] = Math.random() * 0.3 + 0.1;
      pPhases[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));
    const pMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const glowGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x4de8ff,
      transparent: true,
      opacity: 0.6,
    });
    const coreGlow = new THREE.Mesh(glowGeo, glowMat);
    coreGlow.position.y = 0.5;
    scene.add(coreGlow);

    // Bloch sphere group
    const bGroup = new THREE.Group();
    bGroup.position.set(bGroupInitX, bGroupInitY, -4);

    // Outer sphere — larger, darker, more transparent
    const bSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x050d1f,
        transparent: true,
        opacity: 0.25,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
      })
    );
    bGroup.add(bSphere);

    // Wireframe — brighter and more visible
    const blochWire = new THREE.Mesh(
      new THREE.SphereGeometry(1.82, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x2a7ab0,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );
    bGroup.add(blochWire);

    // Equatorial torus — thicker, more opaque
    const eqGeo = new THREE.TorusGeometry(1.8, 0.015, 16, 64);
    const eqMat = new THREE.MeshBasicMaterial({
      color: 0x4de8ff,
      transparent: true,
      opacity: 0.55,
    });
    const eq = new THREE.Mesh(eqGeo, eqMat);
    eq.rotation.x = Math.PI / 2;
    bGroup.add(eq);

    // Inner glow sphere — shows quantum state via color
    const blochInnerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    bGroup.add(blochInnerGlow);

    // Z-axis line (vertical, white)
    const zAxisMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const zAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.8, 0),
      new THREE.Vector3(0, 1.8, 0),
    ]);
    const zAxisLine = new THREE.Line(zAxisGeo, zAxisMat);
    bGroup.add(zAxisLine);

    // Upper pole marker (|0⟩ = north pole)
    const upperPole = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x4de8ff })
    );
    upperPole.position.y = 1.8;
    bGroup.add(upperPole);

    // Lower pole marker (|1⟩ = south pole)
    const lowerPole = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4d6a })
    );
    lowerPole.position.y = -1.8;
    bGroup.add(lowerPole);

    // Pole labels — hidden when sphere enlarged (Bit vs Qubit); overlay shows 0/1 instead
    const poleLabel0 = makeTextSprite("0", [0, 2.3, 0], "#4de8ff");
    const poleLabel1 = makeTextSprite("1", [0, -2.3, 0], "#ff4d6a");
    bGroup.add(poleLabel0);
    bGroup.add(poleLabel1);

    // North pole halo (State 0)
    const northHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x4de8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    northHalo.position.y = 1.8;
    bGroup.add(northHalo);

    // South pole halo (State 1)
    const southHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xff4d6a,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    southHalo.position.y = -1.8;
    bGroup.add(southHalo);

    // Equator halo torus (Superposition)
    const eqHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.08, 8, 48),
      new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    eqHalo.rotation.x = Math.PI / 2;
    bGroup.add(eqHalo);

    // Bloch sphere arrow
    const arrowGroup = new THREE.Group();
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    shaft.position.y = 0.55;
    arrowGroup.add(shaft);
    const head = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.2, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd700 })
    );
    head.position.y = 1.15;
    arrowGroup.add(head);
    bGroup.add(arrowGroup);
    scene.add(bGroup);

    const wallGroup = new THREE.Group();
    wallGroup.visible = false;
    const wallMat = new THREE.MeshPhongMaterial({
      color: 0x1a3050,
      emissive: 0x0a1525,
      transparent: true,
      opacity: 0.85,
    });
    const w1 = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.3), wallMat);
    w1.position.set(-4, 1.5, -8);
    wallGroup.add(w1);
    const w2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3, 0.3), wallMat);
    w2.position.set(0, 1.5, -8);
    wallGroup.add(w2);
    const w3 = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 0.3), wallMat);
    w3.position.set(4, 1.5, -8);
    wallGroup.add(w3);
    const slitGlow = new THREE.MeshBasicMaterial({
      color: 0x4de8ff,
      transparent: true,
      opacity: 0.5,
    });
    ([[-1.75, -8], [1.75, -8], [-1.25, -8], [1.25, -8]] as [number, number][]).forEach(
      ([x, z]) => {
        const g = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3, 0.35), slitGlow);
        g.position.set(x, 1.5, z);
        wallGroup.add(g);
      }
    );
    const deathZone = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 4),
      new THREE.MeshBasicMaterial({
        color: 0xff2244,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      })
    );
    deathZone.rotation.x = -Math.PI / 2;
    deathZone.position.set(0, 0.02, -14);
    wallGroup.add(deathZone);
    const safeZone = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({
        color: 0x4dff91,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      })
    );
    safeZone.rotation.x = -Math.PI / 2;
    safeZone.position.set(5, 0.02, -14);
    wallGroup.add(safeZone);
    wallGroup.add(makeTextSprite("⚠ DEATH ZONE", [0, 3.5, -14], "#ff4466"));
    wallGroup.add(makeTextSprite("✦ ENERGY SPRING", [5, 3.5, -14], "#4dff91"));
    scene.add(wallGroup);

    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 1] = Math.random() * 40 + 5;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x8899cc,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    (sceneRef as React.MutableRefObject<SceneRef>).current = {
      scene,
      camera,
      renderer,
      gridMat,
      particles,
      pGeo,
      pPositions,
      pColors,
      pPhases,
      pSizes,
      pCount,
      coreGlow,
      arrowGroup,
      wallGroup,
      blochInnerGlow,
      blochWire,
      northHalo,
      southHalo,
      eqHalo,
    };

    let time = 0;
    let expandAnim = 0;
    let collapseAnim = 0;
    let phaseFlip = 0;
    let slitProgress = 0;
    let targetExpand = 0;
    let targetPhase = 0;

    // Gate flash tracking
    let lastGateFlashId = -1;
    let gateFlashAnim = 0;
    let gateFlashType = "";

    // Core hue smooth transition
    let currentCoreHue = 0.55;

    // Bloch sphere cinematic focus animation
    let blochFocusAnim = 0;  // 0.0 = corner position, 1.0 = center zoom
    let blochRotY = 0;       // cumulative self-rotation angle

    const animate = () => {
      const id = requestAnimationFrame(animate);
      (sceneRef.current as SceneRef).animId = id;
      time += 0.016;
      const st = stateRef.current;
      const b = bloch(st.quantumState);

      // Smooth 0↔1 transition for cinematic focus
      const targetBloch = cameraFocusRef.current ? 1 : 0;
      blochFocusAnim += (targetBloch - blochFocusAnim) * 0.04;

      // Gate flash detection
      if (st.gateFlash && st.gateFlash.id !== lastGateFlashId) {
        lastGateFlashId = st.gateFlash.id;
        gateFlashAnim = 1.0;
        gateFlashType = st.gateFlash.gate;
      }
      gateFlashAnim *= 0.90;

      targetExpand = st.waveExpanded ? 1 : 0;
      targetPhase = b.phi / Math.PI;
      expandAnim += (targetExpand - expandAnim) * 0.04;
      phaseFlip += (targetPhase - phaseFlip) * 0.06;

      if (st.collapseFlash > 0) {
        collapseAnim = Math.max(0, collapseAnim + 0.03);
        if (collapseAnim > 1) collapseAnim = 0;
      } else {
        collapseAnim *= 0.95;
      }

      wallGroup.visible = st.stage === "doubleSlit";

      if (st.stage === "doubleSlit" && st.slitPhase > 0) {
        slitProgress += (st.slitPhase - slitProgress) * 0.03;
      }

      gridMat.uniforms.uTime.value = time;
      gridMat.uniforms.uExpanded.value = expandAnim;
      gridMat.uniforms.uPhaseFlip.value = phaseFlip;
      gridMat.uniforms.uCollapse.value = collapseAnim;

      const spread = expandAnim * 8 + 0.3;
      for (let i = 0; i < pCount; i++) {
        const angle = pPhases[i] + time * 0.5;
        const radius = (Math.random() * 0.5 + 0.5) * spread;
        const waveHeight = Math.sin(radius * 2 - time * 3) * 0.5 * expandAnim;

        let px = Math.cos(angle + i * 0.01) * radius * (0.3 + Math.random() * 0.7);
        let pz = Math.sin(angle + i * 0.01) * radius * (0.3 + Math.random() * 0.7);
        let py = 0.2 + waveHeight + Math.sin(time * 2 + i) * 0.1;

        if (st.stage === "doubleSlit" && slitProgress > 0.3) {
          const t = Math.min(1, (slitProgress - 0.3) / 0.7);
          pz -= t * 15;
          if (pz < -8 && slitProgress > 0.6) {
            const interference = Math.cos(px * 2 + phaseFlip * Math.PI) * 0.5 + 0.5;
            py *= interference;
            pColors[i * 3] = interference * 0.3 + 0.1;
            pColors[i * 3 + 1] = interference * 0.9;
            pColors[i * 3 + 2] = 1.0 - interference * 0.3;
          }
        }

        pPositions[i * 3] = px;
        pPositions[i * 3 + 1] = py;
        pPositions[i * 3 + 2] = pz;

        if (!(st.stage === "doubleSlit" && pz < -8)) {
          const phase = Math.atan2(pz, px) + phaseFlip * Math.PI;
          const c = Math.sin(phase + time) * 0.5 + 0.5;
          pColors[i * 3] = 0.3 + c * 0.7;
          pColors[i * 3 + 1] = 0.5 + (1 - c) * 0.5;
          pColors[i * 3 + 2] = 1.0 - c * 0.3;
        }
      }
      pGeo.attributes.position!.needsUpdate = true;
      pGeo.attributes.color!.needsUpdate = true;

      // coreGlow — state-based color with smooth hue transition
      const targetHue = b.z > 0.7 ? 0.55 : b.z < -0.7 ? 0.0 : 0.75;
      currentCoreHue += (targetHue - currentCoreHue) * 0.05;

      let coreScale = 1 - expandAnim * 0.7 + 0.3;
      let coreOpacity = (1 - expandAnim * 0.5) * 0.6;
      let coreHue = currentCoreHue;
      let coreSaturation = 0.8;
      let coreLightness = 0.6;

      if (gateFlashType === "X" && gateFlashAnim > 0.01) {
        // X gate: big pulse, flash toward white
        coreScale = (1 - expandAnim * 0.7 + 0.3) + gateFlashAnim * 3.0;
        coreSaturation = 0.8 - gateFlashAnim * 0.8;
        coreLightness = 0.6 + gateFlashAnim * 0.4;
        coreOpacity = Math.min(1, (1 - expandAnim * 0.5) * 0.6 + gateFlashAnim * 0.4);
      } else if (gateFlashType === "Z" && gateFlashAnim > 0.01) {
        // Z gate: hue shift flash + opacity boost
        coreHue = currentCoreHue + gateFlashAnim * 0.5;
        coreOpacity = Math.min(1, (1 - expandAnim * 0.5) * 0.6 + gateFlashAnim * 0.4);
      } else if (gateFlashType === "H" && gateFlashAnim > 0.01) {
        // H gate: burst
        coreScale = (1 - expandAnim * 0.7 + 0.3) + gateFlashAnim * 1.5;
      }

      coreGlow.scale.setScalar(coreScale);
      (coreGlow.material as THREE.MeshBasicMaterial).opacity = coreOpacity;
      (coreGlow.material as THREE.MeshBasicMaterial).color.setHSL(
        coreHue,
        coreSaturation,
        coreLightness
      );

      // Bloch inner glow — color tracks quantum state
      const innerMat = blochInnerGlow.material as THREE.MeshBasicMaterial;
      const innerHue = b.z > 0.1 ? 0.55 : b.z < -0.1 ? 0.0 : 0.75;
      innerMat.color.setHSL(innerHue, 0.9, 0.5 + gateFlashAnim * 0.3);
      const innerOpacityBase = 0.15 + Math.abs(b.z) * 0.2 + gateFlashAnim * 0.3;
      const focusPulse = 0.5 + Math.sin(time * 2.5) * 0.2;
      innerMat.opacity = blochFocusAnim > 0.05
        ? (innerOpacityBase * (1 - blochFocusAnim) + focusPulse * blochFocusAnim)
        : innerOpacityBase;

      // Arrow — snaps faster during gate flash
      const dir = new THREE.Vector3(b.x, b.z, -b.y).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      arrowGroup.quaternion.slerp(quat, 0.08 + gateFlashAnim * 0.17);

      // bGroup: mobile = corner or center on focus, desktop = cinematic zoom
      if (isMobileDevice) {
        if (cameraFocusRef.current) {
          bGroup.position.lerp(new THREE.Vector3(0, 1.0, -1.5), 0.05);
          bGroup.scale.setScalar(2.0);
        } else {
          let mobileX = st.stage === "doubleSlit" ? -7.0 : bGroupInitX;
          let mobileY = st.stage === "doubleSlit" ? bGroupInitY - 5.0 : bGroupInitY;
          bGroup.position.set(mobileX, mobileY, -4);
          bGroup.scale.setScalar(0.8);
          bGroup.rotation.y = 0;
        }
      
      } else {
        bGroup.position.set(
          7  * (1 - blochFocusAnim),
          5.2 * (1 - blochFocusAnim) + 1.2 * blochFocusAnim,
          -4 * (1 - blochFocusAnim)
        );
        bGroup.scale.setScalar(1 + blochFocusAnim * 1.2);
        blochRotY += cameraFocusRef.current ? 0.005 : 0;
        bGroup.rotation.y = blochRotY;
      }

      // Hide 3D pole labels when enlarged so they don't overflow; overlay shows 0/1 clearly
      const showPoleLabels = blochFocusAnim < 0.5;
      poleLabel0.visible = showPoleLabels;
      poleLabel1.visible = showPoleLabels;

      // Wireframe brightens when focused
      (blochWire.material as THREE.MeshBasicMaterial).opacity =
        0.45 + blochFocusAnim * 0.4;

      // Halo opacity based on quantum state
      const bState = bloch(stateRef.current.quantumState);
      const pulse = 0.5 + 0.5 * Math.abs(Math.sin(time * 3));
      (northHalo.material as THREE.MeshBasicMaterial).opacity =
        bState.p0 > 0.9 ? 0.7 * pulse : 0.08;
      (southHalo.material as THREE.MeshBasicMaterial).opacity =
        bState.p1 > 0.9 ? 0.7 * pulse : 0.08;
      (eqHalo.material as THREE.MeshBasicMaterial).opacity =
        bState.isSuperposition ? 0.5 * pulse : 0.08;

      // Camera: dramatic zoom on desktop only; mobile stays fixed
      if (!isMobileDevice) {
        if (blochFocusAnim > 0.01 || cameraFocusRef.current) {
          const camZ = 18 - blochFocusAnim * 9;
          const camY = 8  - blochFocusAnim * 6;
          camera.position.lerp(new THREE.Vector3(0, camY, camZ), 0.04);
          const lookY = blochFocusAnim * 2;
          camera.lookAt(0, lookY, 0);
        } else {
          const ty = 8 + Math.sin(time * 0.5) * 0.3;
          camera.position.lerp(new THREE.Vector3(0, ty, 18), 0.03);
          camera.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      const ref = sceneRef.current as SceneRef;
      if (ref.animId != null) cancelAnimationFrame(ref.animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
      }}
    />
  );
}
