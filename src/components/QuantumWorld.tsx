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
}: QuantumWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Partial<SceneRef>>({});
  const stateRef = useRef({
    quantumState,
    stage,
    waveExpanded,
    collapseFlash,
    slitPhase,
  });

  useEffect(() => {
    stateRef.current = { quantumState, stage, waveExpanded, collapseFlash, slitPhase };
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

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

    const bGroup = new THREE.Group();
    bGroup.position.set(7, 6, -4);
    const bSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshPhysicalMaterial({
        color: 0x0a1628,
        transparent: true,
        opacity: 0.3,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide,
      })
    );
    bGroup.add(bSphere);
    const bWire = new THREE.Mesh(
      new THREE.SphereGeometry(1.21, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x1a3a5c,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      })
    );
    bGroup.add(bWire);
    const eqGeo = new THREE.TorusGeometry(1.2, 0.01, 16, 64);
    const eqMat = new THREE.MeshBasicMaterial({
      color: 0x4de8ff,
      transparent: true,
      opacity: 0.3,
    });
    const eq = new THREE.Mesh(eqGeo, eqMat);
    eq.rotation.x = Math.PI / 2;
    bGroup.add(eq);
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
    wallGroup.add(makeTextSprite("|0⟩", [7.5, 7.4, -4], "#4de8ff"));
    wallGroup.add(makeTextSprite("|1⟩", [7.5, 4.6, -4], "#ff4d6a"));
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
    };

    let time = 0;
    let expandAnim = 0;
    let collapseAnim = 0;
    let phaseFlip = 0;
    let slitProgress = 0;
    let targetExpand = 0;
    let targetPhase = 0;

    const animate = () => {
      const id = requestAnimationFrame(animate);
      (sceneRef.current as SceneRef).animId = id;
      time += 0.016;
      const st = stateRef.current;
      const b = bloch(st.quantumState);

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

      coreGlow.scale.setScalar(1 - expandAnim * 0.7 + 0.3);
      (coreGlow.material as THREE.MeshBasicMaterial).opacity =
        (1 - expandAnim * 0.5) * 0.6;
      const coreHue = Math.sin(time * 2) * 0.5 + 0.5;
      (coreGlow.material as THREE.MeshBasicMaterial).color.setHSL(
        0.55 + coreHue * 0.1,
        0.8,
        0.6
      );

      const dir = new THREE.Vector3(b.x, b.z, -b.y).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      arrowGroup.quaternion.slerp(quat, 0.08);

      camera.position.y = 8 + Math.sin(time * 0.5) * 0.3;

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
