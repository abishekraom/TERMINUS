import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function useGlobeControls(selectedAsset) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  
  // Store spherical coordinates to avoid frequent object creation
  const currentSpherical = useRef(new THREE.Spherical());
  const globeRadius = 1;
  const isAnimating = useRef(false);
  const animStart = useRef(new THREE.Spherical());
  const animEnd = useRef(new THREE.Spherical());
  const animProgress = useRef(0);

  // We track the lookAt target to ensure the camera is always centered on the specific lat/lon
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const startLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Keep a ref to the latest selectedAsset so the useFrame callback sees updates
  const selectedAssetRef = useRef(null);
  selectedAssetRef.current = selectedAsset;

  // Convert lat/lon to a Vector3 point on the sphere
  const getCoordinatesFromLatLng = useCallback((lat, lng, radius = globeRadius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  }, [globeRadius]);

  const zoomToLocation = useCallback((lat, lng, zoomDistance = 2.2) => {
    if (!camera) return;

    // 1. Precise target coordinates on the surface
    const surfacePoint = getCoordinatesFromLatLng(lat, lng, globeRadius);
    targetLookAt.current.copy(surfacePoint);
    startLookAt.current.copy(currentLookAt.current);

    // 2. Camera target position (surfacePoint + zoom offset in normal vector)
    const normal = surfacePoint.clone().normalize();
    const cameraPos = normal.clone().multiplyScalar(zoomDistance);
    
    // Instead of raw sphericals, let's just use Vector3 for position lerp
    // But we want an arced camera path, so we use Spherical interpolation carefully.
    const camSpherical = new THREE.Spherical().setFromVector3(cameraPos);
    animEnd.current.set(zoomDistance, camSpherical.phi, camSpherical.theta);
    animStart.current.setFromVector3(camera.position);
    
    // Normalize theta for shortest path
    let deltaTheta = animEnd.current.theta - animStart.current.theta;
    while (deltaTheta > Math.PI) deltaTheta -= 2 * Math.PI;
    while (deltaTheta < -Math.PI) deltaTheta += 2 * Math.PI;
    animEnd.current.theta = animStart.current.theta + deltaTheta;

    animProgress.current = 0;
    isAnimating.current = true;
  }, [camera, getCoordinatesFromLatLng, globeRadius]);

  useFrame((state, delta) => {
    // If a selected asset exists, compute its current surface point and update the target each frame.
    const sel = selectedAssetRef.current;
    if (sel && sel.lat !== undefined && sel.lon !== undefined) {
      const movingTarget = getCoordinatesFromLatLng(sel.lat, sel.lon);
      
      // Smoothly track the moving target so it doesn't snap
      targetLookAt.current.lerp(movingTarget, 0.1);

      // If not animating, ensure controls target and camera follow immediately
      if (!isAnimating.current && controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        state.camera.lookAt(targetLookAt.current);
        controlsRef.current.update();
      }
    }

    // 1. Idle Drift: Very slow rotation when not explicitly animating
    if (!isAnimating.current && controlsRef.current && !selectedAssetRef.current) {
      if (controlsRef.current.target.lengthSq() < 0.1) {
        // Only drift if looking at the center
        state.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.05);
      }
      controlsRef.current.update();
      if (controlsRef.current.target) {
        state.camera.lookAt(controlsRef.current.target);
      }
      return;
    }

    // 2. Fly-To Animation
    if (isAnimating.current) {
      if (controlsRef.current) {
          controlsRef.current.enabled = false;
      }

      const safeDelta = Math.min(delta, 0.1);
      animProgress.current += safeDelta * 1.5; // Faster, smoother speed
      
      let t = animProgress.current;
      if (t >= 1) {
        t = 1;
        isAnimating.current = false;
        
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current);
          state.camera.lookAt(targetLookAt.current);
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
      }
      
      // Basic eased transition
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      // Position update - arced interpolation
      const r = THREE.MathUtils.lerp(animStart.current.radius, animEnd.current.radius, ease);
      const phi = THREE.MathUtils.lerp(animStart.current.phi, animEnd.current.phi, ease);
      const theta = THREE.MathUtils.lerp(animStart.current.theta, animEnd.current.theta, ease);

      state.camera.position.setFromSphericalCoords(r, phi, theta);
      
      // Target update
      currentLookAt.current.lerpVectors(startLookAt.current, targetLookAt.current, ease);
      
      if (controlsRef.current && isAnimating.current) {
        controlsRef.current.target.copy(currentLookAt.current);
      }
      
      state.camera.lookAt(currentLookAt.current);
    }
  });

  const resetView = useCallback((zoomDistance = 4.0) => {
    if (!camera) return;

    targetLookAt.current.set(0, 0, 0);
    startLookAt.current.copy(currentLookAt.current);

    animStart.current.setFromVector3(camera.position);
    
    // We want the end position to be directly back from the center 0,0,0
    // So we normalize current position to center, and scale to zoomDistance
    const centerDir = camera.position.clone().normalize();
    const endPos = centerDir.multiplyScalar(zoomDistance);
    
    const camSpherical = new THREE.Spherical().setFromVector3(endPos);
    animEnd.current.set(zoomDistance, camSpherical.phi, camSpherical.theta);

    // Normalize theta for shortest path
    let deltaTheta = animEnd.current.theta - animStart.current.theta;
    while (deltaTheta > Math.PI) deltaTheta -= 2 * Math.PI;
    while (deltaTheta < -Math.PI) deltaTheta += 2 * Math.PI;
    animEnd.current.theta = animStart.current.theta + deltaTheta;

    animProgress.current = 0;
    isAnimating.current = true;
  }, [camera]);

  return {
    controlsRef,
    zoomToLocation,
    resetView,
    getCoordinatesFromLatLng,
  };
}
