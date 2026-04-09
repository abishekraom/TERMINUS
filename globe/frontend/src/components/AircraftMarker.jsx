import { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _up = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _axis = new THREE.Vector3();

/**
 * AircraftMarker — Instanced rendering for aircraft.
 * 
 * Visual: Orange/yellow glowing cones (arrow/pyramid shape) that rotate
 * based on heading. Uses InstancedMesh for performance.
 * Smoothly interpolates positions between Firestore updates.
 */
export default function AircraftMarker({ data, selectedId, getCoordinatesFromLatLng, onMarkerClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(null);

  // Position interpolation maps
  const targetPositions = useRef(new Map());
  const currentPositions = useRef(new Map());

  // ConeGeometry: 4 sides = pyramid/arrow shape, rotated to point "forward"
  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.008, 0.022, 4);
    // Rotate so the tip points along +Y by default (will be reoriented per-instance)
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);

  // Update target positions when data changes
  useEffect(() => {
    for (const marker of data) {
      const pos = getCoordinatesFromLatLng(marker.lat, marker.lon, 1.003);

      if (!targetPositions.current.has(marker.id)) {
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

  // Per-frame animation: lerp, heading rotation, pulse, colors
  useFrame((state, delta) => {
    if (!meshRef.current || data.length === 0) return;

    const time = state.clock.getElapsedTime();
    const cameraDistance = state.camera.position.length();
    const safeDelta = Math.min(Math.max(delta, 0.001), 0.1);

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

      // Ref-Based Interpolation: Smooth interpolation over the 5-second window
      // Alpha of 0.05 ensures smooth gliding across the globe every frame
      current.lerp(target, 0.05);

      // Scale with pulse
      const isSelected = selectedId === marker.id;
      const isHovered = hovered === marker.id;
      const pulseSpeed = isSelected ? 4.0 : 3.0;
      const variation = marker.id.charCodeAt(0) * 0.1;

      const baseScale = (isSelected ? 2.0 : (isHovered ? 1.1 : 1.0)) * lodScale;
      const pulseRange = (isSelected ? 0.3 : 0.15) * lodScale;
      const scaleValue = baseScale + Math.sin(time * pulseSpeed + variation) * pulseRange;

      // ─── Heading Rotation ──────────────────────────
      // 1. Position the dummy at the current interpolated position
      dummy.position.copy(current);

      // 2. Make the cone point outward (away from globe center)
      _up.copy(current).normalize();

      // 3. Create a quaternion that orients the cone outward from the globe
      dummy.lookAt(0, 0, 0);
      // Flip to point away from center
      dummy.rotateY(Math.PI);

      // 4. Apply heading rotation around the surface normal (up axis)
      const headingRad = THREE.MathUtils.degToRad(marker.heading || 0);
      _quaternion.setFromAxisAngle(_up, -headingRad);
      dummy.quaternion.premultiply(_quaternion);

      dummy.scale.set(baseScale, baseScale, baseScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color: selected = white, default = orange/amber
      if (isSelected) {
        _color.set('#ffffff');
      } else if (isHovered) {
        _color.set('#ffcc00');
      } else {
        _color.set('#ff8800');
      }
      meshRef.current.setColorAt(i, _color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    meshRef.current.count = data.length;
  });

  // Click handler
  const handleClick = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId != null && instanceId < data.length) {
      onMarkerClick(data[instanceId]);
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const instanceId = e.instanceId;
    if (instanceId != null && instanceId < data.length) {
      const hoveredAircraft = data[instanceId];
      setHovered(hoveredAircraft.id);
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
        color="#ff8800"
        emissive="#ff4400"
        emissiveIntensity={4}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
