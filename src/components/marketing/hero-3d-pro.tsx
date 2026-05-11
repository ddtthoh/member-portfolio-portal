import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  DepthOfField,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";

/* ============ Build N shape ============ */
function buildNShape() {
  const s = new THREE.Shape();
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

/* ============ Shader background gradient ============ */
function GradientBackground() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0a0509") },
      uColorB: { value: new THREE.Color("#1a0d05") },
      uColorC: { value: new THREE.Color("#06070b") },
    }),
    [],
  );
  useFrame((s) => {
    if (ref.current) ref.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, -8]} scale={[40, 22, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={ref}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
          // simple smooth noise
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise(vec2 p){
            vec2 i=floor(p), f=fract(p);
            float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
            vec2 u=f*f*(3.-2.*f);
            return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
          }
          void main(){
            vec2 p = vUv - 0.5;
            float r = length(p);
            float n = noise(vUv*3.0 + uTime*0.05);
            vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.4, r + n*0.15));
            col = mix(col, uColorC, smoothstep(0.45, 0.95, r));
            // golden core glow
            col += vec3(1.0, 0.55, 0.2) * (1.0 - smoothstep(0.0, 0.25, r)) * 0.18;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

/* ============ Scroll proxy (reads window scroll) ============ */
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      setP(Math.min(1, Math.max(0, y / h)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

function ScrollDriver({ logoRef, camRef }: {
  logoRef: React.MutableRefObject<THREE.Group | null>;
  camRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}) {
  const p = useScrollProgress();
  useFrame(() => {
    if (logoRef.current) {
      const target = p * Math.PI * 0.9;
      logoRef.current.rotation.y = THREE.MathUtils.lerp(logoRef.current.rotation.y, target, 0.06);
      logoRef.current.scale.setScalar(THREE.MathUtils.lerp(logoRef.current.scale.x, 1 - p * 0.35, 0.08));
    }
    if (camRef.current) {
      camRef.current.position.z = THREE.MathUtils.lerp(camRef.current.position.z, 7 - p * 1.6, 0.08);
      camRef.current.position.y = THREE.MathUtils.lerp(camRef.current.position.y, 0.2 + p * 0.6, 0.08);
    }
  });
  return null;
}

/* ============ The 3D logo ============ */
function NLogoPro({ groupRef }: { groupRef: React.MutableRefObject<THREE.Group | null> }) {
  const inner = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const { geometry, material, ringMat } = useMemo(() => {
    const shape = buildNShape();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.06,
      bevelThickness: 0.08,
      curveSegments: 24,
    });
    geo.center();
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffd089"),
      metalness: 1.0,
      roughness: 0.16,
      envMapIntensity: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.45,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [120, 520],
      emissive: new THREE.Color("#ff7a1f"),
      emissiveIntensity: 0.18,
    });

    const ring = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffb24a"),
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 1.4,
      emissive: new THREE.Color("#ffaa55"),
      emissiveIntensity: 0.6,
    });

    return { geometry: geo, material: mat, ringMat: ring };
  }, []);

  useFrame((s) => {
    if (!inner.current) return;
    const t = s.clock.elapsedTime;
    inner.current.rotation.y = t * ((Math.PI * 2) / 14);
    inner.current.position.y = Math.sin(t * 0.6) * 0.07;
    inner.current.rotation.x = THREE.MathUtils.lerp(inner.current.rotation.x, mouse.y * 0.18, 0.04);
    inner.current.rotation.z = THREE.MathUtils.lerp(inner.current.rotation.z, -mouse.x * 0.07, 0.04);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.04} floatIntensity={0.22}>
      <group ref={groupRef}>
        <group ref={inner}>
          <mesh geometry={geometry} material={material} castShadow receiveShadow />
          {/* outer halo rings */}
          <mesh position={[0, 0, -0.25]} material={ringMat}>
            <torusGeometry args={[2.05, 0.012, 16, 160]} />
          </mesh>
          <mesh position={[0, 0, -0.25]} rotation={[0, 0, Math.PI / 8]} material={ringMat}>
            <torusGeometry args={[2.35, 0.006, 16, 160]} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

/* ============ Subtle depth particles (max 80) ============ */
function DepthSparkles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const N = 80;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = -Math.random() * 6 - 1;
    }
    return arr;
  }, []);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.012;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={"#ffd89c"} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  const logoRef = useRef<THREE.Group | null>(null);
  const camRef = useRef<THREE.PerspectiveCamera | null>(null);
  const { camera } = useThree();
  useEffect(() => { camRef.current = camera as THREE.PerspectiveCamera; }, [camera]);

  return (
    <>
      <GradientBackground />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 4, 6]} intensity={1.2} color={"#fff1cc"} />
      <directionalLight position={[-6, -2, 3]} intensity={0.8} color={"#ff5a3c"} />
      <pointLight position={[0, 0, 4]} intensity={1.2} color={"#ffb347"} />
      <Environment preset="studio" environmentIntensity={0.85} />

      <NLogoPro groupRef={logoRef} />
      <DepthSparkles />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.4} scale={10} blur={2.6} far={4} color={"#ff6a1f"} />

      <ScrollDriver logoRef={logoRef} camRef={camRef} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.55}
          mipmapBlur
          kernelSize={KernelSize.LARGE}
        />
        <DepthOfField focusDistance={0.012} focalLength={0.04} bokehScale={2.4} />
        <ChromaticAberration
          offset={[0.0009, 0.0014] as unknown as THREE.Vector2}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.18} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export function Hero3DPro() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0.2, 7], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
