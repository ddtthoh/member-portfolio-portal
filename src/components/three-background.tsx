import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function makeSpriteTexture(inner = "rgba(255,244,214,1)", mid = "rgba(232,201,122,0.55)") {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.4, mid);
  grad.addColorStop(1, "rgba(232,201,122,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

type Packet = { edge: number; t: number; speed: number; alive: boolean; cascade: number };

function NodeWeb({ count, interactive }: { count: number; interactive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const packetsRef = useRef<THREE.Points>(null);
  const sparklesRef = useRef<THREE.Points>(null);
  const { camera, viewport } = useThree();

  const nodeSprite = useMemo(() => makeSpriteTexture(), []);
  const packetSprite = useMemo(
    () => makeSpriteTexture("rgba(255,250,225,1)", "rgba(255,220,140,0.9)"),
    [],
  );

  // Build nodes + edges once
  const data = useMemo(() => {
    const home = new Float32Array(count * 3);
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);
    const ignite = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10 + 1.0; // bias upward
      const z = (Math.random() - 0.5) * 6;
      home[i * 3] = x;
      home[i * 3 + 1] = y;
      home[i * 3 + 2] = z;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      colors[i * 3] = 0.96;
      colors[i * 3 + 1] = 0.82;
      colors[i * 3 + 2] = 0.5;
      sizes[i] = 0.18;
      seeds[i] = Math.random() * Math.PI * 2;
    }

    // Build edges by proximity, max ~3 per node
    const maxEdgesPerNode = 6;
    const proximity = 4.2;
    const edgeSet = new Set<string>();
    const adjacency: number[][] = Array.from({ length: count }, () => []);
    const edgeList: { a: number; b: number; length: number; shimmer: number }[] = [];

    const dists: { j: number; d: number }[] = [];
    for (let i = 0; i < count; i++) {
      dists.length = 0;
      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        const dx = home[i * 3] - home[j * 3];
        const dy = home[i * 3 + 1] - home[j * 3 + 1];
        const dz = home[i * 3 + 2] - home[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < proximity) dists.push({ j, d });
      }
      dists.sort((a, b) => a.d - b.d);
      let added = 0;
      for (const { j, d } of dists) {
        if (added >= maxEdgesPerNode) break;
        if (adjacency[j].length >= maxEdgesPerNode + 1) continue;
        const key = i < j ? `${i}_${j}` : `${j}_${i}`;
        if (edgeSet.has(key)) continue;
        edgeSet.add(key);
        adjacency[i].push(j);
        adjacency[j].push(i);
        edgeList.push({ a: i, b: j, length: d, shimmer: Math.random() * Math.PI * 2 });
        added++;
      }
    }

    const edgePositions = new Float32Array(edgeList.length * 6);
    const edgeColors = new Float32Array(edgeList.length * 6);
    for (let e = 0; e < edgeList.length; e++) {
      const { a, b } = edgeList[e];
      edgePositions[e * 6] = home[a * 3];
      edgePositions[e * 6 + 1] = home[a * 3 + 1];
      edgePositions[e * 6 + 2] = home[a * 3 + 2];
      edgePositions[e * 6 + 3] = home[b * 3];
      edgePositions[e * 6 + 4] = home[b * 3 + 1];
      edgePositions[e * 6 + 5] = home[b * 3 + 2];
      for (let k = 0; k < 6; k++) edgeColors[e * 6 + k] = 0.6;
    }

    const PACKET_POOL = 120;
    const packetPositions = new Float32Array(PACKET_POOL * 3);
    const packetAlpha = new Float32Array(PACKET_POOL);
    const packets: Packet[] = Array.from({ length: PACKET_POOL }, () => ({
      edge: 0,
      t: 0,
      speed: 0,
      alive: false,
      cascade: 0,
    }));
    for (let p = 0; p < PACKET_POOL; p++) {
      packetPositions[p * 3] = 9999;
      packetPositions[p * 3 + 1] = 9999;
      packetPositions[p * 3 + 2] = 0;
    }

    // Sparkles: 2 small twinkling dots between each connected pair
    const SPARKS_PER_EDGE = 2;
    const sparkCount = edgeList.length * SPARKS_PER_EDGE;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkColors = new Float32Array(sparkCount * 3);
    const sparkSeeds = new Float32Array(sparkCount);
    const sparkOffsets = new Float32Array(sparkCount); // 0..1 along the edge
    for (let s = 0; s < sparkCount; s++) {
      sparkSeeds[s] = Math.random() * Math.PI * 2;
      sparkOffsets[s] = 0.2 + Math.random() * 0.6; // mid section of edge
      sparkColors[s * 3] = 1.0;
      sparkColors[s * 3 + 1] = 0.92;
      sparkColors[s * 3 + 2] = 0.7;
    }

    // Per-edge pulse intensity (0..1), decays over time, spikes when packet fires
    const edgePulse = new Float32Array(edgeList.length);

    return {
      home, pos, colors, sizes, seeds, ignite,
      adjacency, edgeList,
      edgePositions, edgeColors,
      packets, packetPositions, packetAlpha,
      sparkPositions, sparkColors, sparkSeeds, sparkOffsets, sparkCount,
      edgePulse,
    };
  }, [count]);

  // Mouse / interaction refs
  const mouseNDC = useRef(new THREE.Vector2(999, 999));
  const mouseWorld = useRef(new THREE.Vector3(999, 999, 0));
  const parallaxTarget = useRef(new THREE.Vector2(0, 0));
  const shockwave = useRef<{ x: number; y: number; z: number; strength: number } | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  const fireFromNode = (nodeIdx: number, cascade: number) => {
    data.ignite[nodeIdx] = Math.min(1, data.ignite[nodeIdx] + (cascade === 0 ? 1.0 : 0.6));
    const neighbors = data.adjacency[nodeIdx];
    for (const nb of neighbors) {
      // find edge index
      let edgeIdx = -1;
      for (let e = 0; e < data.edgeList.length; e++) {
        const ed = data.edgeList[e];
        if ((ed.a === nodeIdx && ed.b === nb) || (ed.b === nodeIdx && ed.a === nb)) {
          edgeIdx = e;
          break;
        }
      }
      if (edgeIdx < 0) continue;
      // find free packet
      for (let p = 0; p < data.packets.length; p++) {
        const pk = data.packets[p];
        if (!pk.alive) {
          pk.alive = true;
          pk.edge = edgeIdx;
          pk.t = 0;
          pk.speed = 1.6 / Math.max(0.5, data.edgeList[edgeIdx].length);
          // direction: a -> b, so we set "from" as nodeIdx
          // store cascade depth on packet; reuse field via sign of speed
          pk.cascade = cascade;
          // store source node identity by sign of speed — instead, track via small hack:
          // we'll mark .t starting at 0 means going a->b; if source is b, start at 1 going b->a (negative speed)
          if (data.edgeList[edgeIdx].a !== nodeIdx) {
            pk.t = 1;
            pk.speed = -pk.speed;
          }
          break;
        }
      }
    }
  };

  const triggerClick = (worldX: number, worldY: number) => {
    // Find nearest node in XY
    let nearest = -1;
    let bestD = Infinity;
    for (let i = 0; i < count; i++) {
      const dx = data.pos[i * 3] - worldX;
      const dy = data.pos[i * 3 + 1] - worldY;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        nearest = i;
      }
    }
    if (nearest < 0) return;
    fireFromNode(nearest, 0);
    shockwave.current = {
      x: data.pos[nearest * 3],
      y: data.pos[nearest * 3 + 1],
      z: data.pos[nearest * 3 + 2],
      strength: 1,
    };
  };

  useEffect(() => {
    if (!interactive) return;
    const onMove = (e: PointerEvent) => {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      parallaxTarget.current.x = mouseNDC.current.x;
      parallaxTarget.current.y = mouseNDC.current.y;
    };
    const onLeave = () => mouseNDC.current.set(999, 999);
    const onClick = (e: MouseEvent) => {
      const ndc = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, hit)) {
        triggerClick(hit.x, hit.y);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive, camera]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // mouse world
    if (interactive && mouseNDC.current.x < 900) {
      raycaster.setFromCamera(mouseNDC.current, camera);
      const hit = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, hit)) mouseWorld.current.copy(hit);
    } else {
      mouseWorld.current.set(999, 999, 0);
    }

    const repelRadius = 1.4;
    const repelStrength = 2.5;
    const springStrength = 1.8;
    const mx = mouseWorld.current.x;
    const my = mouseWorld.current.y;

    const sw = shockwave.current;
    const swR = sw ? 1.5 + (1 - sw.strength) * 4 : 0;
    const swStrength = sw ? sw.strength * 6 : 0;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const seed = data.seeds[i];

      const driftX = Math.sin(t * 0.32 + seed) * 0.18;
      const driftY = Math.cos(t * 0.27 + seed * 1.3) * 0.16;
      const driftZ = Math.sin(t * 0.22 + seed * 0.7) * 0.12;

      const tx = data.home[ix] + driftX;
      const ty = data.home[ix + 1] + driftY;
      const tz = data.home[ix + 2] + driftZ;

      let px = data.pos[ix];
      let py = data.pos[ix + 1];
      let pz = data.pos[ix + 2];

      px += (tx - px) * springStrength * dt;
      py += (ty - py) * springStrength * dt;
      pz += (tz - pz) * springStrength * dt;

      // mouse repulsion
      if (interactive && mx < 900) {
        const dx = px - mx;
        const dy = py - my;
        const dsq = dx * dx + dy * dy;
        if (dsq < repelRadius * repelRadius) {
          const d = Math.sqrt(dsq) + 0.001;
          const f = (1 - d / repelRadius) ** 2 * repelStrength * dt;
          px += (dx / d) * f;
          py += (dy / d) * f;
        }
      }

      // shockwave
      if (sw) {
        const dx = px - sw.x;
        const dy = py - sw.y;
        const dz = pz - sw.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
        const ringWidth = 1.2;
        if (Math.abs(d - swR) < ringWidth) {
          const fall = 1 - Math.abs(d - swR) / ringWidth;
          const f = fall * swStrength * dt;
          px += (dx / d) * f;
          py += (dy / d) * f;
          pz += (dz / d) * f;
        }
      }

      data.pos[ix] = px;
      data.pos[ix + 1] = py;
      data.pos[ix + 2] = pz;

      // ignite decay
      data.ignite[i] = Math.max(0, data.ignite[i] - dt * 1.4);
      const ig = data.ignite[i];

      // size
      data.sizes[i] = 0.18 * (1 + ig * 1.2);

      // color: gold base -> bright cream when ignited
      const r = 0.96 + ig * 0.04;
      const g = 0.82 + ig * 0.15;
      const b = 0.5 + ig * 0.4;
      data.colors[ix] = r;
      data.colors[ix + 1] = g;
      data.colors[ix + 2] = b;
    }

    if (sw) {
      sw.strength -= dt * 1.2;
      if (sw.strength <= 0) shockwave.current = null;
    }

    // Update node geometry attributes
    if (nodesRef.current) {
      const geom = nodesRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      const colAttr = geom.attributes.color as THREE.BufferAttribute;
      const sizeAttr = geom.attributes.size as THREE.BufferAttribute | undefined;
      posAttr.array = data.pos;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      if (sizeAttr) sizeAttr.needsUpdate = true;
    }

    // Update edges
    for (let e = 0; e < data.edgeList.length; e++) {
      const { a, b, shimmer } = data.edgeList[e];
      data.edgePositions[e * 6] = data.pos[a * 3];
      data.edgePositions[e * 6 + 1] = data.pos[a * 3 + 1];
      data.edgePositions[e * 6 + 2] = data.pos[a * 3 + 2];
      data.edgePositions[e * 6 + 3] = data.pos[b * 3];
      data.edgePositions[e * 6 + 4] = data.pos[b * 3 + 1];
      data.edgePositions[e * 6 + 5] = data.pos[b * 3 + 2];

      const igA = data.ignite[a];
      const igB = data.ignite[b];
      const sh = 0.5 + 0.5 * Math.sin(t * 1.2 + shimmer);
      const baseA = 0.35 + sh * 0.25 + igA * 1.5;
      const baseB = 0.35 + sh * 0.25 + igB * 1.5;
      // color as gold-ish
      data.edgeColors[e * 6] = Math.min(1, 0.7 * baseA);
      data.edgeColors[e * 6 + 1] = Math.min(1, 0.55 * baseA);
      data.edgeColors[e * 6 + 2] = Math.min(1, 0.25 * baseA);
      data.edgeColors[e * 6 + 3] = Math.min(1, 0.7 * baseB);
      data.edgeColors[e * 6 + 4] = Math.min(1, 0.55 * baseB);
      data.edgeColors[e * 6 + 5] = Math.min(1, 0.25 * baseB);
    }
    if (edgesRef.current) {
      const geom = edgesRef.current.geometry as THREE.BufferGeometry;
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // Packets
    for (let p = 0; p < data.packets.length; p++) {
      const pk = data.packets[p];
      if (!pk.alive) {
        data.packetPositions[p * 3] = 9999;
        data.packetPositions[p * 3 + 1] = 9999;
        data.packetAlpha[p] = 0;
        continue;
      }
      pk.t += pk.speed * dt;
      const edge = data.edgeList[pk.edge];
      const ax = data.pos[edge.a * 3];
      const ay = data.pos[edge.a * 3 + 1];
      const az = data.pos[edge.a * 3 + 2];
      const bx = data.pos[edge.b * 3];
      const by = data.pos[edge.b * 3 + 1];
      const bz = data.pos[edge.b * 3 + 2];
      const tt = Math.max(0, Math.min(1, pk.t));
      data.packetPositions[p * 3] = ax + (bx - ax) * tt;
      data.packetPositions[p * 3 + 1] = ay + (by - ay) * tt;
      data.packetPositions[p * 3 + 2] = az + (bz - az) * tt;
      data.packetAlpha[p] = 1;

      if (pk.t >= 1 || pk.t <= 0) {
        const arrived = pk.t >= 1 ? edge.b : edge.a;
        pk.alive = false;
        if (pk.cascade < 1) {
          data.ignite[arrived] = Math.min(1, data.ignite[arrived] + 0.5);
          fireFromNode(arrived, pk.cascade + 1);
        } else {
          data.ignite[arrived] = Math.min(1, data.ignite[arrived] + 0.3);
        }
      }
    }
    if (packetsRef.current) {
      const geom = packetsRef.current.geometry as THREE.BufferGeometry;
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // Sparkles between nodes (twinkling dots along each edge)
    const SPARKS_PER_EDGE = 2;
    for (let e = 0; e < data.edgeList.length; e++) {
      const ed = data.edgeList[e];
      const ax = data.pos[ed.a * 3];
      const ay = data.pos[ed.a * 3 + 1];
      const az = data.pos[ed.a * 3 + 2];
      const bx = data.pos[ed.b * 3];
      const by = data.pos[ed.b * 3 + 1];
      const bz = data.pos[ed.b * 3 + 2];
      for (let k = 0; k < SPARKS_PER_EDGE; k++) {
        const s = e * SPARKS_PER_EDGE + k;
        const baseOffset = data.sparkOffsets[s];
        const seed = data.sparkSeeds[s];
        const tt = baseOffset + Math.sin(t * 0.6 + seed) * 0.08;
        const cl = Math.max(0.05, Math.min(0.95, tt));
        data.sparkPositions[s * 3] = ax + (bx - ax) * cl;
        data.sparkPositions[s * 3 + 1] = ay + (by - ay) * cl;
        data.sparkPositions[s * 3 + 2] = az + (bz - az) * cl;
        const twinkle = 0.55 + 0.45 * Math.sin(t * 2.4 + seed * 3.1);
        data.sparkColors[s * 3] = 1.0 * twinkle;
        data.sparkColors[s * 3 + 1] = 0.92 * twinkle;
        data.sparkColors[s * 3 + 2] = 0.7 * twinkle;
      }
    }
    if (sparklesRef.current) {
      const geom = sparklesRef.current.geometry as THREE.BufferGeometry;
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // Parallax / global rotation
    if (groupRef.current) {
      const gx = parallaxTarget.current.y * 0.12 + Math.cos(t * 0.05) * 0.04;
      const gy = parallaxTarget.current.x * 0.18 + Math.sin(t * 0.06) * 0.06;
      groupRef.current.rotation.x += (gx - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (gy - groupRef.current.rotation.y) * 0.05;
    }
  });

  const pointSize = Math.max(0.16, Math.min(0.32, viewport.width / 60));

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.edgePositions, 3]}
            count={data.edgePositions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[data.edgeColors, 3]}
            count={data.edgeColors.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </lineSegments>

      {/* Nodes */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.pos, 3]}
            count={data.pos.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[data.colors, 3]}
            count={data.colors.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={nodeSprite}
          size={pointSize}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </points>

      {/* Packets */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.packetPositions, 3]}
            count={data.packetPositions.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={packetSprite}
          size={pointSize * 0.9}
          sizeAttenuation
          color={"#fff4d6"}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </points>

      {/* Sparkles between nodes */}
      <points ref={sparklesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.sparkPositions, 3]}
            count={data.sparkPositions.length / 3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[data.sparkColors, 3]}
            count={data.sparkColors.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={packetSprite}
          size={pointSize * 0.55}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.95}
        />
      </points>
    </group>
  );
}

export function ThreeBackground({
  className,
  fade = true,
}: {
  className?: string;
  fade?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(110);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEnabled(true);
      setInteractive(false);
      return;
    }
    setEnabled(true);
    const mobile = window.innerWidth < 768;
    setCount(mobile ? 60 : 110);
    setInteractive(true);
  }, []);

  if (!enabled) return null;

  const maskStyle = fade
    ? {
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 55%, rgba(0,0,0,0) 100%)",
      }
    : undefined;

  return (
    <div
      aria-hidden
      className={
        className ??
        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] sm:h-[620px]"
      }
      style={{ opacity: 0.95, ...maskStyle }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <NodeWeb count={count} interactive={interactive} />
      </Canvas>
    </div>
  );
}
