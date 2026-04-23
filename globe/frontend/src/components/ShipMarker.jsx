import { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const dummy = new THREE.Object3D();
const _color = new THREE.Color();

/**
 * ShipMarker — Instanced rendering for maritime vessels.
 * 
 * Visual: Cyan/green glowing spheres with pulse animation.
 * Uses InstancedMesh for single-draw-call performance.
 * Smoothly interpolates (lerp) between position updates.
 */
export default function ShipMarker({ data, selectedId, getCoordinatesFromLatLng, onMarkerClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(null);

  // Position interpolation maps
  const targetPositions = useRef(new Map());
  const currentPositions = useRef(new Map());

  // Memoized geometry — never recreated
  const geometry = useMemo(() => new THREE.SphereGeometry(0.012, 12, 12), []);

  // Update target positions when data changes
  useEffect(() => {
    console.log('[ShipMarker] useEffect triggered, data length:', data.length);
    for (const marker of data) {
      const pos = getCoordinatesFromLatLng(marker.lat, marker.lon, 1.0);

      if (!targetPositions.current.has(marker.id)) {
        // First appearance → teleport immediately
        targetPositions.current.set(marker.id, pos.clone());
        currentPositions.current.set(marker.id, pos.clone());
      } else {
        targetPositions.current.set(marker.id, pos.clone());
      }
    }

    // Clean up removed markers
    const currentIds = new Set(data.map(m => m.id));
    for (const id of targetPositions.current.keys()) {
      if (!currentIds.has(id)) {
        targetPositions.current.delete(id);
        currentPositions.current.delete(id);
      }
    }
  }, [data, getCoordinatesFromLatLng]);

  // Per-frame: smooth interpolation + pulse animation + real-time movement
  useFrame((state, delta) => {
    if (!meshRef.current || data.length === 0) {
      // Only log occasionally to avoid spam
      if (Math.random() < 0.001) console.log('[ShipMarker] useFrame early return, meshRef:', !!meshRef.current, 'data length:', data.length);
      return;
    }

    const time = state.clock.getElapsedTime();
    const cameraDistance = state.camera.position.length();
    const safeDelta = Math.min(Math.max(delta, 0.001), 0.1);

    // LOD scaling — smaller when far, larger when close
    const lodScale = THREE.MathUtils.lerp(
      1.2, 0.45,
      THREE.MathUtils.clamp((cameraDistance - 1.5) / 3.0, 0, 1)
    );

    for (let i = 0; i < data.length; i++) {
      const marker = data[i];
      const target = targetPositions.current.get(marker.id);
      let current = currentPositions.current.get(marker.id);

      if (!target) continue;

      if (!current) {
        current = target.clone();
        currentPositions.current.set(marker.id, current);
      }

      // Ref-Based Interpolation: Smooth interpolation toward target over the 5-second data window
      // Alpha of 0.05 ensures it slides smoothly toward the new coordinate every frame without snapping
      current.lerp(target, 0.05);

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
    meshRef.current.count = data.length;
  });

  // Click handler via instanceId
  const handleClick = (e) => {
    console.log('[ShipMarker] pointer down event', e);
    e.stopPropagation();
    const instanceId = e.instanceId;
    console.log('[ShipMarker] instanceId:', instanceId, 'data length:', data.length);
    if (instanceId != null && instanceId < data.length) {
      const clicked = data[instanceId];
      console.log('[ShipMarker] clicking vessel:', clicked.id, clicked.name);
      onMarkerClick(clicked);
    }
  };

  // Hover handler - sets hover state and triggers click
  const handlePointerOver = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    console.log('[ShipMarker] pointer over instanceId:', instanceId, 'data length:', data.length);
    if (instanceId != null && instanceId < data.length) {
      const hoveredVessel = data[instanceId];
      console.log('[ShipMarker] hovering vessel:', hoveredVessel.id, hoveredVessel.name);
      setHovered(hoveredVessel.id);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(null);
    document.body.style.cursor = 'auto';
  };

  if (data.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, 40000]}
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
