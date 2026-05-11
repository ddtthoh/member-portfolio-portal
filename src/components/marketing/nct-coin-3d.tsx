import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Coin() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.6;
      ref.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.4) * 0.15;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.4}>
      <group ref={ref}>
        {/* Coin body */}
        <mesh>
          <cylinderGeometry args={[1.4, 1.4, 0.18, 64]} />
          <meshPhysicalMaterial
            color={"#ffd166"}
            metalness={1}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.6}
          />
        </mesh>
        {/* Inner ring */}
        <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.18, 64]} />
          <meshStandardMaterial color={"#7a5b13"} metalness={1} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.18, 64]} />
          <meshStandardMaterial color={"#7a5b13"} metalness={1} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* NCT text — extruded plane on each face */}
        <NCTLabel y={0.092} flip={false} />
        <NCTLabel y={-0.092} flip={true} />
      </group>
    </Float>
  );
}

function NCTLabel({ y, flip }: { y: number; flip: boolean }) {
  // Build "NCT" via canvas texture
  const tex = (() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#3a2a08";
    ctx.font = "bold 200px Cormorant Garamond, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NCT", 256, 270);
    ctx.strokeStyle = "rgba(122,91,19,.6)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  return (
    <mesh position={[0, y, 0]} rotation={[flip ? Math.PI / 2 : -Math.PI / 2, 0, flip ? Math.PI : 0]}>
      <circleGeometry args={[1.22, 64]} />
      <meshStandardMaterial
        map={tex ?? undefined}
        transparent
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
}

export function NCTCoin3D() {
  return (
    <div className="relative h-[360px] w-full">
      <div className="lg-halo absolute inset-0" />
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.6, 4.4], fov: 38 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={1.4} color={"#fff1cc"} />
        <directionalLight position={[-4, -2, 3]} intensity={0.6} color={"#ff7a4a"} />
        <pointLight position={[0, 2, 3]} intensity={1} color={"#ffd166"} />
        <Environment preset="sunset" />
        <Coin />
      </Canvas>
    </div>
  );
}
