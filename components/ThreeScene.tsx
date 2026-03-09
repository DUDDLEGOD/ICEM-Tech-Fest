import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const NODE_COUNT = 350;
const CONNECTION_DISTANCE = 1.8;
const SPREAD = 5;

function NetworkMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const target = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * SPREAD;
      arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }
    return arr;
  }, []);

  const { linePositions, lineColors, maxLines } = useMemo(() => {
    const max = NODE_COUNT * 12;
    return { linePositions: new Float32Array(max * 6), lineColors: new Float32Array(max * 6), maxLines: max };
  }, []);

  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(nodes, 3));
    return geo;
  }, [nodes]);

  useFrame((_, delta) => {
    if (!groupRef.current || !linesRef.current) return;
    groupRef.current.rotation.y += delta * 0.03;
    target.current.x = (mouse.y * viewport.height) / 80;
    target.current.y = (mouse.x * viewport.width) / 80;
    groupRef.current.rotation.x += (target.current.x - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (target.current.y - groupRef.current.rotation.y) * 0.02;

    let lineIdx = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      const ax = nodes[i * 3], ay = nodes[i * 3 + 1], az = nodes[i * 3 + 2];
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const bx = nodes[j * 3], by = nodes[j * 3 + 1], bz = nodes[j * 3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < CONNECTION_DISTANCE && lineIdx < maxLines) {
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          const o = lineIdx * 6;
          // Gradient from stormy-teal (#006466) to deep-purple (#4d194d)
          linePositions[o] = ax; linePositions[o+1] = ay; linePositions[o+2] = az;
          linePositions[o+3] = bx; linePositions[o+4] = by; linePositions[o+5] = bz;
          lineColors[o] = 0.0 * alpha; lineColors[o+1] = 0.39 * alpha; lineColors[o+2] = 0.40 * alpha;
          lineColors[o+3] = 0.30 * alpha; lineColors[o+4] = 0.10 * alpha; lineColors[o+5] = 0.30 * alpha;
          lineIdx++;
        }
      }
    }

    const geo = linesRef.current.geometry;
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineIdx * 6), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(lineColors.slice(0, lineIdx * 6), 3));
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    geo.setDrawRange(0, lineIdx * 2);
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial color="#006466" size={0.04} sizeAttenuation transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <color attach="background" args={['#0a0a12']} />
        <fog attach="fog" args={['#0a0a12', 4, 10]} />
        <NetworkMesh />
      </Canvas>
      <style>{`canvas{opacity:0;animation:fi 2s ease-in forwards .3s}@keyframes fi{to{opacity:1}}`}</style>
    </div>
  );
}
