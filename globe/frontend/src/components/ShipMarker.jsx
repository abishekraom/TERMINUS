import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTelemetryStore } from '../store/useTelemetryStore';

const dummy = new THREE.Object3D();
const _color = new THREE.Color();

/**
 * ShipMarker — Instanced rendering for maritime vessels.
 * 
 * Visual: Cyan/green glowing spheres with pulse animation.
 * Uses InstancedMesh for single-draw-call performance.
 * Smoothly interpolates (lerp) between position updates.
 */
export default function ShipMarker({ selectedId, getCoordinatesFromLatLng, onMarkerClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(null);

  // Position interpolation maps
  const targetPositions = useRef(new Map());
  const currentPositions = useRef(new Map());

  // Memoized geometry — never recreated
  const geometry = useMemo(() => new THREE.SphereGeometry(0.003, 12, 12), []);

  // Per-frame: smooth interpolation + pulse animation + real-time movement
  useFrame((state, delta) => {
    const vessels = useTelemetryStore.getState().vessels;
    if (!meshRef.current || vessels.length === 0) {
      if (meshRef.current) meshRef.current.count = 0;
      return;
    }

    const time = state.clock.getElapsedTime();
    const cameraDistance = state.camera.position.length();

    // LOD scaling — smaller when far, larger when close
    const lodScale = THREE.MathUtils.lerp(
      1.2, 0.45,
      THREE.MathUtils.clamp((cameraDistance - 1.5) / 3.0, 0, 1)
    );

    for (let i = 0; i < vessels.length; i++) {
      const marker = vessels[i];
      const pos = getCoordinatesFromLatLng(marker.lat, marker.lon, 1.0);
      
      let target = targetPositions.current.get(marker.id);
      let current = currentPositions.current.get(marker.id);

      if (!target) {
        target = pos.clone();
        current = pos.clone();
        targetPositions.current.set(marker.id, target);
        currentPositions.current.set(marker.id, current);
      } else {
        target.copy(pos);
      }

      // Ref-Based Interpolation: Smooth interpolation toward target over the 5-second data window
      // Alpha of 0.005 ensures it slides smoothly toward the new coordinate every frame without snapping
      current.lerp(target, 0.005);

      // Calculate simulated movement based on heading and speed
      // Convert heading (degrees) to radians, with offset for globe coordinate system
      const headingRad = ((marker.heading || 0) + 90) * (Math.PI / 180);
      const speedFactor = Math.min((marker.speed || 0) / 50, 1) * 0.003; // Scale speed for visual
      const moveX = Math.cos(headingRad) * speedFactor;
      const moveY = Math.sin(headingRad) * speedFactor;
      
      // Add subtle movement oscillation
      const wobble = Math.sin(time * 3 + i * 0.5) * 0.001;

      dummy.position.set(
        current.x + moveX + wobble,
        current.y + wobble,
        current.z + moveY + wobble
      );

      // Pulse animation
      const isSelected = selectedId === marker.id;
      const isHovered = hovered === marker.id;
      const pulseSpeed = isSelected ? 4.0 : 2.5;
      const variation = marker.id.charCodeAt(0) * 0.1;

      const baseScale = (isSelected ? 1.8 : (isHovered ? 0.88 : 0.8)) * lodScale;
      const pulseRange = (isSelected ? 0.3 : 0.12) * lodScale;
      const scaleValue = baseScale + Math.sin(time * pulseSpeed + variation) * pulseRange;

      dummy.scale.set(scaleValue, scaleValue, scaleValue);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color: selected = white, default = cyan
      if (isSelected) {
        _color.set('#ffffff');
      } else if (isHovered) {
        _color.set('#66ffff');
      } else {
        _color.set('#00e5ff');
      }
      meshRef.current.setColorAt(i, _color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.count = vessels.length;
  });

  // Click handler via instanceId
  const handleClick = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    const vessels = useTelemetryStore.getState().vessels;
    if (instanceId != null && instanceId < vessels.length) {
      const clicked = vessels[instanceId];
      onMarkerClick(clicked);
    }
  };

  // Hover handler - sets hover state and triggers click
  const handlePointerOver = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    const vessels = useTelemetryStore.getState().vessels;
    if (instanceId != null && instanceId < vessels.length) {
      const hoveredVessel = vessels[instanceId];
      setHovered(hoveredVessel.id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, 150000]}
      onPointerDown={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#00e5ff"
        emissive="#00bcd4"
        emissiveIntensity={4}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
