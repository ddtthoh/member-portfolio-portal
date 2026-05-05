import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Nodes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const arr: { pos: THREE.Vector3; speed: number; offset: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 8,
        ),
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const connections = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 3.4) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  const lineGeom = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(
    () => new Float32Array(Math.max(connections.length, 1) * 6),
    [connections.length],
  );

  const packets = useRef(
    Array.from({ length: 14 }, () => ({
      edge: Math.floor(Math.random() * Math.max(connections.length, 1)),
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.3,
    })),
  );
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { camera } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.04;
      group.current.rotation.x = Math.sin(t * 0.1) * 0.08;
    }
    camera.position.x += (mouse.current.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.current.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    if (lineGeom.current && connections.length > 0) {
      for (let k = 0; k < connections.length; k++) {
        const [i, j] = connections[k];
        const a = nodes[i];
        const b = nodes[j];
        const ax = a.pos.x + Math.sin(t * a.speed + a.offset) * 0.15;
        const ay = a.pos.y + Math.cos(t * a.speed + a.offset) * 0.15;
        const az = a.pos.z;
        const bx = b.pos.x + Math.sin(t * b.speed + b.offset) * 0.15;
        const by = b.pos.y + Math.cos(t * b.speed + b.offset) * 0.15;
        const bz = b.pos.z;
        positions[k * 6] = ax;
        positions[k * 6 + 1] = ay;
        positions[k * 6 + 2] = az;
        positions[k * 6 + 3] = bx;
        positions[k * 6 + 4] = by;
        positions[k * 6 + 5] = bz;
      }
      lineGeom.current.attributes.position.needsUpdate = true;
    }

    if (packetMesh.current && connections.length > 0) {
      for (let p = 0; p < packets.current.length; p++) {
        const pk = packets.current[p];
        pk.t += delta * pk.speed;
        if (pk.t >= 1) {
          pk.t = 0;
          pk.edge = Math.floor(Math.random() * connections.length);
          pk.speed = 0.15 + Math.random() * 0.3;
        }
        const [i, j] = connections[pk.edge];
        const a = nodes[i].pos;
        const b = nodes[j].pos;
        dummy.position.set(
          a.x + (b.x - a.x) * pk.t,
          a.y + (b.y - a.y) * pk.t,
          a.z + (b.z - a.z) * pk.t,
        );
        const s = 0.06 + Math.sin(pk.t * Math.PI) * 0.05;
        dummy.scale.setScalar(s);
        dummy.updateMatrix();
        packetMesh.current.setMatrixAt(p, dummy.matrix);
      }
      packetMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((n, idx) => (
        <mesh key={idx} position={n.pos}>
          <icosahedronGeometry args={[0.13, 0]} />
          <meshBasicMaterial color="#e8d4a0" wireframe transparent opacity={0.55} />
        </mesh>
      ))}
      {nodes.map((n, idx) => (
        <mesh key={`c${idx}`} position={n.pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#fff4d6" transparent opacity={0.9} />
        </mesh>
      ))}
      <lineSegments>
        <bufferGeometry ref={lineGeom}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#c9a567" transparent opacity={0.18} />
      </lineSegments>
      <instancedMesh ref={packetMesh} args={[undefined, undefined, packets.current.length]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#ffd97a" transparent opacity={0.95} />
      </instancedMesh>
    </group>
  );
}

export function ThreeBackground() {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(36);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setEnabled(true);
    const mobile = window.innerWidth < 768;
    setCount(mobile ? 18 : 36);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.7 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Nodes count={count} />
      </Canvas>
    </div>
  );
}
