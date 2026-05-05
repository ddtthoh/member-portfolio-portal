import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function makeSpriteTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,244,214,1)");
  grad.addColorStop(0.35, "rgba(232,212,160,0.6)");
  grad.addColorStop(1, "rgba(232,212,160,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function ParticleField({ count, interactive }: { count: number; interactive: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { camera, size, viewport } = useThree();

  const sprite = useMemo(() => makeSpriteTexture(), []);

  // Buffers: positions (current), homes (target), seeds (per-particle phase)
  const { positions, homes, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const homes = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute in a soft slab that fills the camera frustum
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      homes[i * 3] = x;
      homes[i * 3 + 1] = y;
      homes[i * 3 + 2] = z;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, homes, seeds };
  }, [count]);

  // Mouse in NDC -> world plane at z = 0
  const mouseNDC = useRef(new THREE.Vector2(999, 999));
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 0));
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onLeave = () => {
      mouseNDC.current.set(999, 999);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Update mouse world position
    if (interactive && mouseNDC.current.x < 900) {
      raycaster.setFromCamera(mouseNDC.current, camera);
      const hit = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, hit);
      if (hit) mouseWorld.current.copy(hit);
    } else {
      mouseWorld.current.set(999, 999, 0);
    }

    const repelRadius = 1.8;
    const repelStrength = 4.5;
    const springStrength = 1.6;

    const arr = positions;
    const mx = mouseWorld.current.x;
    const my = mouseWorld.current.y;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const hx = homes[ix];
      const hy = homes[ix + 1];
      const hz = homes[ix + 2];
      const seed = seeds[i];

      // Gentle drift (cheap pseudo-curl)
      const driftX = Math.sin(t * 0.35 + seed) * 0.25;
      const driftY = Math.cos(t * 0.28 + seed * 1.3) * 0.22;
      const driftZ = Math.sin(t * 0.22 + seed * 0.7) * 0.15;

      const targetX = hx + driftX;
      const targetY = hy + driftY;
      const targetZ = hz + driftZ;

      let px = arr[ix];
      let py = arr[ix + 1];
      let pz = arr[ix + 2];

      // Spring back toward drifting target
      px += (targetX - px) * springStrength * dt;
      py += (targetY - py) * springStrength * dt;
      pz += (targetZ - pz) * springStrength * dt;

      // Cursor repulsion
      if (interactive && mx < 900) {
        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < repelRadius * repelRadius) {
          const dist = Math.sqrt(distSq) + 0.0001;
          const falloff = 1 - dist / repelRadius;
          const force = falloff * falloff * repelStrength * dt;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }
      }

      arr[ix] = px;
      arr[ix + 1] = py;
      arr[ix + 2] = pz;
    }

    if (points.current) {
      const geom = points.current.geometry as THREE.BufferGeometry;
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      points.current.rotation.y = Math.sin(t * 0.05) * 0.08;
      points.current.rotation.x = Math.cos(t * 0.04) * 0.04;
    }
  });

  // Adjust point size by viewport so it scales with screen
  const pointSize = Math.max(0.05, Math.min(0.12, viewport.width / 140));

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={pointSize}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={"#f6e2b3"}
        opacity={0.9}
      />
    </points>
  );
}

export function ThreeBackground() {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(2200);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setEnabled(true);
    const mobile = window.innerWidth < 768;
    setCount(mobile ? 900 : 2400);
    setInteractive(!mobile);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.85 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleField count={count} interactive={interactive} />
      </Canvas>
    </div>
  );
}
