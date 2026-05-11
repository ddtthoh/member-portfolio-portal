import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, GodRays } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";

/* ---------- Build a stylized N shape and extrude it ---------- */
function buildNShape() {
  const s = new THREE.Shape();
  // Stroke thickness 0.5, width 2, height 3
  s.moveTo(0, 0);
  s.lineTo(0.55, 0);
  s.lineTo(0.55, 2.05);
  s.lineTo(1.65, 0);
  s.lineTo(2.2, 0);
  s.lineTo(2.2, 3);
  s.lineTo(1.65, 3);
  s.lineTo(1.65, 0.95);
  s.lineTo(0.55, 3);
  s.lineTo(0, 3);
  s.lineTo(0, 0);
  return s;
}

/* ---------- Gradient-injected metallic material ---------- */
function makeGradientMat(opts?: { emissive?: number }) {
  const mat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 1.0,
    roughness: 0.18,
    envMapIntensity: 1.6,
  });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
       varying vec3 vWPos;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <fog_vertex>",
      `#include <fog_vertex>
       vWPos = (modelMatrix * vec4(position, 1.0)).xyz;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
       varying vec3 vWPos;`,
    );
    // Mix gold (left/top) -> red (right/bottom) based on world X & Y
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       vec3 gold = vec3(1.0, 0.78, 0.27);
       vec3 amber = vec3(1.0, 0.55, 0.15);
       vec3 red = vec3(1.0, 0.22, 0.13);
       float t = clamp((vWPos.x + 1.6) / 3.2, 0.0, 1.0);
       float ty = clamp((1.6 - vWPos.y) / 3.2, 0.0, 1.0);
       vec3 grad = mix(gold, amber, t);
       grad = mix(grad, red, ty * 0.85);
       diffuseColor.rgb *= grad;`,
    );
    // Add emissive glow that follows the same gradient
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
       vec3 gold2 = vec3(1.0, 0.78, 0.27);
       vec3 red2 = vec3(1.0, 0.28, 0.16);
       float te = clamp((vWPos.x + 1.6) / 3.2, 0.0, 1.0);
       totalEmissiveRadiance += mix(gold2, red2, te) * ${(opts?.emissive ?? 0.35).toFixed(2)};`,
    );
  };
  return mat;
}

/* ---------- The 3D logo group ---------- */
function NLogo({ sunRef }: { sunRef: React.MutableRefObject<THREE.Mesh | null> }) {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const { geometry, material, hexMat } = useMemo(() => {
    const shape = buildNShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.05,
      bevelThickness: 0.06,
      curveSegments: 16,
    });
    geo.center();
    const mat = makeGradientMat({ emissive: 0.45 });
    const hex = new THREE.MeshPhysicalMaterial({
      color: "#1a1410",
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.45,
      transparent: true,
      opacity: 0.35,
    });
    return { geometry: geo, material: mat, hexMat: hex };
  }, []);

  useFrame((s) => {
    if (!group.current) return;
    const t = s.clock.elapsedTime;
    // 12s/turn slow rotation
    group.current.rotation.y = t * ((Math.PI * 2) / 12);
    // gentle float
    group.current.position.y = Math.sin(t * 0.6) * 0.08;
    // mouse parallax tilt
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.2, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -mouse.x * 0.08, 0.04);
  });

  // Hex frame points (flat hexagon prism around the N)
  const hexPoints = useMemo(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      pts.push([Math.cos(a) * 2.4, Math.sin(a) * 2.4]);
    }
    const sh = new THREE.Shape();
    sh.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) sh.lineTo(...pts[i]);
    sh.closePath();
    const inner = new THREE.Path();
    const ipts: [number, number][] = pts.map(([x, y]) => [x * 0.9, y * 0.9]);
    inner.moveTo(...ipts[0]);
    for (let i = 1; i < ipts.length; i++) inner.lineTo(...ipts[i]);
    inner.closePath();
    sh.holes.push(inner);
    return new THREE.ExtrudeGeometry(sh, {
      depth: 0.7,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.03,
      bevelSegments: 4,
    });
  }, []);

  return (
    <Float speed={1.1} rotationIntensity={0.05} floatIntensity={0.25}>
      <group ref={group}>
        {/* Hidden "sun" mesh used as god-ray source */}
        <mesh ref={sunRef} position={[0, 0, -0.4]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color={"#ffb347"} />
        </mesh>

        {/* Hex glass frame */}
        <mesh geometry={hexPoints} material={hexMat} position={[0, 0, -0.3]} />

        {/* The N */}
        <mesh geometry={geometry} material={material} castShadow receiveShadow />

        {/* Subtle inner glow ring */}
        <mesh position={[0, 0, -0.25]}>
          <torusGeometry args={[2.0, 0.012, 16, 128]} />
          <meshBasicMaterial color={"#ffd166"} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

/* ---------- Effects with safe sun ref ---------- */
function Effects({ sunRef }: { sunRef: React.MutableRefObject<THREE.Mesh | null> }) {
  const sun = sunRef.current;
  if (!sun) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.6}
        mipmapBlur
        kernelSize={KernelSize.LARGE}
      />
      <GodRays
        sun={sun}
        blendFunction={BlendFunction.SCREEN}
        samples={50}
        density={0.96}
        decay={0.94}
        weight={0.5}
        exposure={0.42}
        clampMax={1}
        kernelSize={KernelSize.SMALL}
        blur
      />
    </EffectComposer>
  );
}

/* ---------- Subtle starfield (NOT a particle storm) ---------- */
function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const N = 180;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 7 + Math.random() * 4;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p) - 4;
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={"#ffe5b3"} transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  const sunRef = useRef<THREE.Mesh | null>(null);
  // Trigger one-frame re-render so Effects can read sunRef
  const { invalidate } = useThree();
  useEffect(() => { invalidate(); }, [invalidate]);

  return (
    <>
      <color attach="background" args={["#06070b"]} />
      <fog attach="fog" args={["#06070b", 10, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 4, 6]} intensity={1.5} color={"#fff1cc"} />
      <directionalLight position={[-6, -2, 3]} intensity={0.9} color={"#ff5a3c"} />
      <pointLight position={[0, 0, 4]} intensity={1.4} color={"#ffb347"} />
      <Environment preset="night" />

      <NLogo sunRef={sunRef} />
      <Starfield />
      <Sparkles count={45} scale={9} size={2.2} speed={0.25} color={"#ffd166"} />

      <Effects sunRef={sunRef} />
    </>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.2, 7], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
