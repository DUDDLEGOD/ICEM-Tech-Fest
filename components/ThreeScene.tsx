import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const DRONE_COUNT = 1500;

function DroneShow() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { mouse, viewport } = useThree();

  const MAX_LINES = 3000;
  const CHECK_COUNT = 800; // Check connections among a subset of drones for performance
  const CONNECTION_DISTANCE = 2.5;

  const { linePosArr, lineColArr } = useMemo(() => ({
    linePosArr: new Float32Array(MAX_LINES * 6),
    lineColArr: new Float32Array(MAX_LINES * 6)
  }), []);

  // Pre-calculate positions for different formations
  const { scatterPositions, globePositions, shipPositions } = useMemo(() => {
    const scatter = new Float32Array(DRONE_COUNT * 3);
    const globe = new Float32Array(DRONE_COUNT * 3);
    const ship = new Float32Array(DRONE_COUNT * 3);

    // Golden angle for sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < DRONE_COUNT; i++) {
        // 1. Scatter (Nebula)
        const thetaScat = Math.random() * Math.PI * 2;
        const radiusScat = 5 + Math.random() * 8;
        const yScat = (Math.random() - 0.5) * 15;
        scatter[i * 3] = Math.cos(thetaScat) * radiusScat;
        scatter[i * 3 + 1] = yScat;
        scatter[i * 3 + 2] = Math.sin(thetaScat) * radiusScat;

        // 2. Globe
        const yGlobe = 1 - (i / (DRONE_COUNT - 1)) * 2;
        const radiusGlobe = Math.sqrt(1 - yGlobe * yGlobe);
        const thetaGlobe = phi * i;
        const scaleGlobe = 3;
        globe[i * 3] = Math.cos(thetaGlobe) * radiusGlobe * scaleGlobe;
        globe[i * 3 + 1] = yGlobe * scaleGlobe;
        globe[i * 3 + 2] = Math.sin(thetaGlobe) * radiusGlobe * scaleGlobe;

        // 3. Saturn Ring
        const thetaRing = Math.random() * Math.PI * 2;
        const radiusRing = 3.5 + (Math.random() * Math.random()) * 2; // Bias towards inner ring
        const yRing = (Math.random() - 0.5) * 0.4;

        ship[i * 3] = Math.cos(thetaRing) * radiusRing;
        ship[i * 3 + 1] = yRing;
        ship[i * 3 + 2] = Math.sin(thetaRing) * radiusRing;
    }
    return { scatterPositions: scatter, globePositions: globe, shipPositions: ship };
  }, []);

  // 0: Globe, 1: Ship, 2: Scatter
  const [formation, setFormation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormation((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Active positions state tracker
  const currentPositions = useRef(new Float32Array(DRONE_COUNT * 3));
  useEffect(() => {
    for (let i = 0; i < DRONE_COUNT * 3; i++) currentPositions.current[i] = scatterPositions[i];
  }, [scatterPositions]);

  const scratchObject3D = useMemo(() => new THREE.Object3D(), []);

  // To prevent the wireframe from only appearing on drones 0-300, we maintain a randomized index list
  const randomIndices = useMemo(() => {
    const indices = Array.from({ length: DRONE_COUNT }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Choose target array based on formation
    let targetPositions = globePositions;
    if (formation === 1) targetPositions = shipPositions;
    if (formation === 2) targetPositions = scatterPositions;

    // Smooth position interpolation
    for (let i = 0; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        currentPositions.current[i3] = THREE.MathUtils.lerp(currentPositions.current[i3], targetPositions[i3], delta * 1.5);
        currentPositions.current[i3+1] = THREE.MathUtils.lerp(currentPositions.current[i3+1], targetPositions[i3+1], delta * 1.5);
        currentPositions.current[i3+2] = THREE.MathUtils.lerp(currentPositions.current[i3+2], targetPositions[i3+2], delta * 1.5);

        scratchObject3D.position.set(
            currentPositions.current[i3],
            currentPositions.current[i3+1],
            currentPositions.current[i3+2]
        );

        // Add subtle hovering / wiggling
        scratchObject3D.position.y += Math.sin(state.clock.elapsedTime * 2 + i) * 0.02;
        scratchObject3D.position.x += Math.cos(state.clock.elapsedTime * 2 + i) * 0.02;

        scratchObject3D.updateMatrix();
        meshRef.current.setMatrixAt(i, scratchObject3D.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // --- Wireframe Connections ---
    let lineIdx = 0;
    // We cycle through the randomized indices based on time so the lines organically dance around the whole show
    const frameOffset = Math.floor(state.clock.elapsedTime * 10) % DRONE_COUNT;

    for (let i = 0; i < CHECK_COUNT; i++) {
        // Pick a pseudo-random drone from our shuffled list
        const rIndex1 = randomIndices[(i + frameOffset) % DRONE_COUNT];
        const i3 = rIndex1 * 3;
        const ax = currentPositions.current[i3];
        const ay = currentPositions.current[i3+1];
        const az = currentPositions.current[i3+2];

        // Only check connections against a larger window of other random drones for denser wireframes
        for (let j = 1; j < 60; j++) {
            const rIndex2 = randomIndices[(i + j + frameOffset) % DRONE_COUNT];
            const j3 = rIndex2 * 3;
            const bx = currentPositions.current[j3];
            const by = currentPositions.current[j3+1];
            const bz = currentPositions.current[j3+2];

            const dx = ax - bx;
            const dy = ay - by;
            const dz = az - bz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < CONNECTION_DISTANCE && lineIdx < MAX_LINES) {
              const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.8;
              const o = lineIdx * 6;
              linePosArr[o] = ax; linePosArr[o+1] = ay; linePosArr[o+2] = az;
              linePosArr[o+3] = bx; linePosArr[o+4] = by; linePosArr[o+5] = bz;

              // Cyan color scaling with alpha
              const colorValue = 0.8 * alpha;
              lineColArr[o] = 0.0; lineColArr[o+1] = colorValue; lineColArr[o+2] = colorValue;
              lineColArr[o+3] = 0.0; lineColArr[o+4] = colorValue; lineColArr[o+5] = colorValue;

              lineIdx++;
            }
        }
    }

    if (linesRef.current) {
        const geo = linesRef.current.geometry;
        geo.setAttribute('position', new THREE.BufferAttribute(linePosArr.slice(0, lineIdx * 6), 3));
        geo.setAttribute('color', new THREE.BufferAttribute(lineColArr.slice(0, lineIdx * 6), 3));
        geo.attributes.position.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
        geo.setDrawRange(0, lineIdx * 2);
    }

    // Global Rotation
    if (formation === 0) { // Globe spins nicely
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta);
    } else if (formation === 1) { // Ring tilts and spins organically
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1, delta * 2);
    } else { // Scatter slow rotation
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, DRONE_COUNT]}>
        {/* Diamond shaped drones */}
        <octahedronGeometry args={[0.04, 0]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 pointer-events-auto overflow-hidden">
      <Canvas camera={{ position: [0, 0, 9], fov: 60 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
        <color attach="background" args={['#0a0a12']} />
        <fog attach="fog" args={['#0a0a12', 4, 15]} />
        <DroneShow />
      </Canvas>
      <style>{`canvas{opacity:0;animation:fi 2s ease-in forwards .3s}@keyframes fi{to{opacity:1}}`}</style>
    </div>
  );
}
