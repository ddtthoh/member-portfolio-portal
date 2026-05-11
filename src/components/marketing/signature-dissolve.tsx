import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { ClientOnly } from "./client-only";

/* Generate N-shape sample points (in 2D) */
function sampleNPoints(count: number) {
  const out: THREE.Vector3[] = [];
  // Two vertical bars + diagonal
  const W = 2.2, H = 3.0, T = 0.55;
  while (out.length < count) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    let inside = false;
    if (x < T) inside = true; // left bar
    else if (x > W - T) inside = true; // right bar
    else {
      // diagonal: y vs line from (T, H) to (W-T, 0)
      const slope = (0 - H) / (W - 2 * T);
      const yOnLine = H + slope * (x - T);
      if (Math.abs(y - yOnLine) < T * 0.55) inside = true;
    }
    if (inside) out.push(new THREE.Vector3(x - W / 2, y - H / 2, (Math.random() - 0.5) * 0.4));
  }
  return out;
}

function sampleTorusPoints(count: number, R = 1.4, r = 0.45) {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = (R + r * Math.cos(v)) * Math.sin(u);
    const z = r * Math.sin(v);
    // make it face the camera-ish (rotate plane to upright coin)
    out.push(new THREE.Vector3(x, z, y * 0.4));
  }
  return out;
}

function ParticleMorph({ progress }: { progress: React.MutableRefObject<number> }) {
  const COUNT = 3200;
  const ref = useRef<THREE.Points>(null);

  const { posA, posB, current, sizes } = useMemo(() => {
    const A = sampleNPoints(COUNT);
    const B = sampleTorusPoints(COUNT);
    // shuffle B for a swirl assignment
    for (let i = B.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [B[i], B[j]] = [B[j], B[i]];
    }
    const cur = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      cur[i * 3] = A[i].x;
      cur[i * 3 + 1] = A[i].y;
      cur[i * 3 + 2] = A[i].z;
      sz[i] = 0.6 + Math.random() * 0.8;
    }
    return { posA: A, posB: B, current: cur, sizes: sz };
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    const p = THREE.MathUtils.smoothstep(progress.current, 0, 1);
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const a = posA[i], b = posB[i];
      // Add a swirl during morph (mid-transition bulge outward)
      const bulge = Math.sin(p * Math.PI) * 0.6;
      const dirX = a.x - b.x, dirY = a.y - b.y;
      const len = Math.sqrt(dirX * dirX + dirY * dirY) + 0.0001;
      const nx = -dirY / len, ny = dirX / len;
      const swirl = bulge * (sizes[i] - 0.7);
      const x = a.x * (1 - p) + b.x * p + nx * swirl;
      const y = a.y * (1 - p) + b.y * p + ny * swirl;
      const z = a.z * (1 - p) + b.z * p + Math.sin(t * 1.2 + i) * 0.02 * (1 - Math.abs(0.5 - p) * 2);
      current[i * 3] = x;
      current[i * 3 + 1] = y;
      current[i * 3 + 2] = z;
    }
    attr.needsUpdate = true;
    ref.current.rotation.y = p * Math.PI * 0.5 + t * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={"#ffcf78"}
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CoinRing({ progress }: { progress: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const p = THREE.MathUtils.smoothstep(progress.current, 0.65, 1);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = p * 0.85;
    ref.current.rotation.z = s.clock.elapsedTime * 0.4;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[1.42, 0.012, 16, 200]} />
      <meshBasicMaterial color={"#ffd166"} transparent opacity={0} />
    </mesh>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <>
      <color attach="background" args={["#06070b"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 4]} intensity={1.2} color={"#ffb347"} />
      <ParticleMorph progress={progress} />
      <CoinRing progress={progress} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.1} luminanceThreshold={0.1} luminanceSmoothing={0.6} mipmapBlur kernelSize={KernelSize.LARGE} />
        <Vignette eskil={false} offset={0.2} darkness={0.8} />
      </EffectComposer>
    </>
  );
}

export function SignatureDissolve() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [label, setLabel] = useState("THE LOGO BECOMES THE TOKEN");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Map: when section top hits middle of viewport (rect.top = vh*0.5) -> 0
      // when section bottom hits middle -> 1
      const total = rect.height + vh * 0.5;
      const traveled = vh * 0.5 - rect.top;
      const p = Math.min(1, Math.max(0, traveled / total));
      progress.current = p;
      if (p < 0.5) setLabel("N · DISSOLVING");
      else if (p < 0.95) setLabel("REASSEMBLING");
      else setLabel("NCT · MATERIALIZED");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[180vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ClientOnly>
          <Canvas
            dpr={[1, 1.7]}
            camera={{ position: [0, 0, 5.2], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          >
            <Scene progress={progress} />
          </Canvas>
        </ClientOnly>
        <div className="pointer-events-none absolute inset-x-0 top-10 z-10 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-foreground/55">{label}</div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-10 text-center">
          <div style={{ fontFamily: "var(--font-display)" }} className="text-[clamp(1.6rem,4vw,3rem)] font-light tracking-[-0.03em]">
            From <span className="lg-tagline italic" style={{ fontFamily: "var(--font-serif)" }}>Brand</span> to{" "}
            <span className="lg-tagline italic" style={{ fontFamily: "var(--font-serif)" }}>Asset</span>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            scroll to witness the transformation
          </div>
        </div>
      </div>
    </section>
  );
}
