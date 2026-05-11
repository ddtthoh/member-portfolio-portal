import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function NLogo() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.35;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  // "N" approximated with 3 boxes — left bar, right bar, diagonal slab
  return (
    <group ref={group} scale={1.15}>
      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.6}>
        <mesh position={[-1.1, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 3, 0.55]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.18}
            emissive="#7a5b13"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[1.1, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 3, 0.55]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.18}
            emissive="#7a5b13"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4.2]} castShadow>
          <boxGeometry args={[0.55, 3.6, 0.55]} />
          <meshStandardMaterial
            color="#e8c869"
            metalness={1}
            roughness={0.12}
            emissive="#9a7016"
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* Glass ring around */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[2.6, 0.04, 16, 100]} />
          <MeshTransmissionMaterial
            color="#7fd4e4"
            thickness={0.4}
            roughness={0.05}
            transmission={1}
            ior={1.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.05;
  });
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * 3;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(p) * Math.cos(t);
    positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
    positions[i * 3 + 2] = r * Math.cos(p);
  }
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#d4af37" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function Hero3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff5d6" />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color="#7fd4e4" />
      <pointLight position={[0, 0, 4]} intensity={1} color="#d4af37" />
      <Environment preset="night" />
      <NLogo />
      <Particles />
      <Sparkles count={60} scale={10} size={3} speed={0.3} color="#e8c869" />
    </Canvas>
  );
}
