import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useDeviceCapability } from "@/hooks/use-device-capability";
import { useTranslation } from "react-i18next";

type Node = { id: string; label: string; sub?: string };

/**
 * 3D constellation: center "you" node + orbiting member nodes.
 * Pure visual layer — links to data via hover label.
 */
export function NetworkConstellation({ nodes }: { nodes: Node[] }) {
  const { t } = useTranslation();
  const cap = useDeviceCapability();
  const small = cap.isPhone;
  const trimmed = small && nodes.length > 14 ? nodes.slice(0, 14) : nodes;
  const dprMax = small ? 1.25 : cap.isTablet ? 1.6 : 2;
  const height = small ? "h-[280px]" : cap.isTablet ? "h-[340px]" : "h-[420px]";

  return (
    <div
      className={`relative ${height} w-full overflow-hidden rounded-2xl`}
      style={{ touchAction: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, small ? 10 : 9], fov: 55 }}
        dpr={[1, dprMax]}
        gl={{ antialias: !small, alpha: true, powerPreference: small ? "low-power" : "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffd97a" />
        <pointLight position={[-5, -3, -4]} intensity={0.6} color="#7ec8ff" />
        <Scene nodes={trimmed} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={small ? 0.4 : 0.6}
          rotateSpeed={small ? 0.6 : 1}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_oklab,var(--background)_75%,transparent)_100%)]" />
      {cap.coarse && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/30 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur">
          {t("components.networkConstellation.dragToOrbit")}
        </div>
      )}
    </div>
  );
}

function Scene({ nodes }: { nodes: Node[] }) {
  const positions = useMemo(() => {
    const n = Math.max(nodes.length, 1);
    return nodes.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 3.4;
      return new THREE.Vector3(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      );
    });
  }, [nodes]);

  return (
    <group>
      {/* Center node */}
      <CenterOrb />
      {/* Lines to each node */}
      {positions.map((p, i) => (
        <LinkLine key={`l${i}`} to={p} />
      ))}
      {/* Member nodes */}
      {positions.map((p, i) => (
        <MemberNode key={nodes[i].id} position={p} label={nodes[i].label} sub={nodes[i].sub} />
      ))}
    </group>
  );
}

function CenterOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.4;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
  });
  return (
    <Float floatIntensity={0.5} speed={1.4}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshPhysicalMaterial
          color="#ffd97a"
          roughness={0.18}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#ffb84a"
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}

function MemberNode({
  position,
  label,
  sub,
}: {
  position: THREE.Vector3;
  label: string;
  sub?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffe9b8"
          roughness={0.25}
          metalness={0.7}
          emissive="#ffb84a"
          emissiveIntensity={0.5}
        />
      </mesh>
      <Html
        distanceFactor={9}
        position={[0, 0.5, 0]}
        center
        style={{ pointerEvents: "none" }}
      >
        <div className="whitespace-nowrap rounded-md border border-gold/30 bg-background/70 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur-md">
          {label}
          {sub && <div className="text-[9px] normal-case tracking-normal text-muted-foreground">{sub}</div>}
        </div>
      </Html>
    </group>
  );
}

function LinkLine({ to }: { to: THREE.Vector3 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0, to.x, to.y, to.z], 3),
    );
    return g;
  }, [to]);
  return (
    <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffd97a, transparent: true, opacity: 0.25 }))} />
  );
}
