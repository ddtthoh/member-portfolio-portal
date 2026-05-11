import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, Sparkles, Billboard } from "@react-three/drei";
import * as THREE from "three";
import naslabMark from "@/assets/naslab-mark.png";

/* -------------------------------------------------------------
   NASLAB Hero 3D — looping wow scene
   - Rotating 3D logo mark (real PNG mapped onto a beveled plane,
     mirrored back face, rim lights, slow orbit)
   - Dual particle galaxies (gold + ember-red) drifting in 3D
   - Animated network constellation around the mark
   - Soft volumetric sparkles on top
   ------------------------------------------------------------- */

function LogoMark() {
  const tex = useLoader(THREE.TextureLoader, naslabMark);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;

  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.45;
      group.current.position.y = Math.sin(t * 0.8) * 0.12;
    }
    if (halo.current) {
      halo.current.rotation.z = t * 0.15;
      const sc = 1 + Math.sin(t * 1.4) * 0.04;
      halo.current.scale.set(sc, sc, 1);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group}>
        {/* glow halo behind */}
        <mesh ref={halo} position={[0, 0, -0.15]}>
          <circleGeometry args={[2.2, 64]} />
          <meshBasicMaterial
            color={"#ffb347"}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.2]}>
          <circleGeometry args={[3.2, 64]} />
          <meshBasicMaterial
            color={"#ff3d2e"}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* front face */}
        <mesh>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            map={tex}
            transparent
            alphaTest={0.05}
            metalness={0.6}
            roughness={0.25}
            emissive={"#ffae3a"}
            emissiveMap={tex}
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* glass orbit ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 16, 200]} />
          <meshStandardMaterial
            color={"#ffd166"}
            metalness={1}
            roughness={0.2}
            emissive={"#d4af37"}
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh rotation={[Math.PI / 1.8, Math.PI / 4, 0]}>
          <torusGeometry args={[2.35, 0.008, 16, 200]} />
          <meshStandardMaterial
            color={"#ff6b3d"}
            metalness={1}
            roughness={0.2}
            emissive={"#ff3d2e"}
            emissiveIntensity={0.55}
          />
        </mesh>
      </group>
    </Float>
  );
}

function ParticleField({
  count = 1400,
  color = "#d4af37",
  radius = 6,
  size = 0.022,
  speed = 0.05,
}: {
  count?: number;
  color?: string;
  radius?: number;
  size?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.5 + Math.random() * 0.7);
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.7;
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, [count, radius]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConstellationRing() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3 }[] = [];
    const N = 14;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const r = 3.6 + Math.sin(i * 1.7) * 0.25;
      arr.push({
        pos: new THREE.Vector3(
          Math.cos(a) * r,
          Math.sin(i * 0.7) * 0.8,
          Math.sin(a) * r,
        ),
      });
    }
    return arr;
  }, []);

  const linePositions = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i].pos;
      const b = nodes[(i + 1) % nodes.length].pos;
      lines.push(a.x, a.y, a.z, b.x, b.y, b.z);
      const c = nodes[(i + 3) % nodes.length].pos;
      lines.push(a.x, a.y, a.z, c.x, c.y, c.z);
    }
    return new Float32Array(lines);
  }, [nodes]);

  useFrame((s) => {
    if (group.current) group.current.rotation.y = -s.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={"#ffb347"}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      {nodes.map((n, i) => (
        <Billboard key={i} position={n.pos}>
          <mesh>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#ffd166" : "#ff5a3c"}
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Billboard>
      ))}
    </group>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.4, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#06070b"]} />
      <fog attach="fog" args={["#06070b", 9, 18]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 4, 6]} intensity={1.4} color={"#fff1cc"} />
      <directionalLight position={[-6, -2, 3]} intensity={0.9} color={"#ff5a3c"} />
      <pointLight position={[0, 0, 4]} intensity={1.2} color={"#ffb347"} />
      <Environment preset="night" />

      <LogoMark />
      <ConstellationRing />
      <ParticleField count={1400} color={"#ffc857"} radius={6.5} size={0.022} speed={0.04} />
      <ParticleField count={700} color={"#ff5a3c"} radius={8} size={0.018} speed={-0.02} />
      <ParticleField count={400} color={"#ffffff"} radius={4.5} size={0.012} speed={0.07} />

      <Sparkles count={80} scale={12} size={3} speed={0.35} color={"#ffd166"} />
      <Sparkles count={40} scale={8} size={2} speed={0.5} color={"#ff7a4a"} />
    </Canvas>
  );
}
