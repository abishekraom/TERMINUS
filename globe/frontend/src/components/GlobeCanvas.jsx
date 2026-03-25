import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import VesselLayer from './VesselLayer';
import { useGlobeControls } from '../hooks/useGlobeControls';

// We extract the inner scene into its own component to use the useGlobeControls hook
// which requires the <Canvas> context to be already established.
function GlobeScene({ onMarkerSelect, selectedAsset, targetLocation, onAssetCountChange, showVessels }) {
  const { controlsRef, zoomToLocation, resetView, getCoordinatesFromLatLng } = useGlobeControls();

  const [isRotating, setIsRotating] = useState(true);

  const handleMarkerClick = (marker) => {
    // If clicking the same marker, toggle it off to zoom out
    if (selectedAsset && selectedAsset.id === marker.id) {
      if (onMarkerSelect) onMarkerSelect(null);
      return;
    }

    // Trigger the smooth cinematic zoom toward the marker coordinates
    zoomToLocation(marker.lat, marker.lon, 2.2);
    setIsRotating(false);
    if (onMarkerSelect) onMarkerSelect(marker);
  };

  // Watch for external calls to zoom (like clicking a location in the bottom bar)
  useEffect(() => {
    if (targetLocation && targetLocation.lat !== undefined && targetLocation.lon !== undefined) {
      zoomToLocation(targetLocation.lat, targetLocation.lon, 2.2);
      setIsRotating(false); // Stop rotation
    }
  }, [targetLocation, zoomToLocation]);

  // Handle zooming back out when selection is cleared (e.g., via Esc or clicking again)
  useEffect(() => {
    if (!selectedAsset) {
      resetView();
      setIsRotating(true); // Resume idle rotation
    }
  }, [selectedAsset, resetView]);

  return (
    <>
      <ambientLight intensity={0.25} />

      {/* Primary "Sun" light - Stark, high contrast */}
      <directionalLight
        position={[10, 5, 5]}
        intensity={4}
        color="#fff4e0"
      />

      {/* Blue Rim/Fill light for the dark side */}
      <directionalLight
        position={[-10, -5, -5]}
        intensity={0.8}
        color="#0066ff"
      />

      {/* Orbit controls with restricted zooming and panning to keep Earth centered */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={1.2}
        maxDistance={6.0}
        rotateSpeed={0.5}
        autoRotate={isRotating}
        autoRotateSpeed={0.15}
        makeDefault
      />

      <Earth />

      {showVessels && (
        <VesselLayer
          selectedId={selectedAsset?.id}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
          onMarkerClick={handleMarkerClick}
          onAssetCountChange={onAssetCountChange}
        />
      )}

      {/* Subtle star background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-surface/50 border border-threat-red/30 p-6 text-center">
          <div className="space-y-4">
            <div className="text-threat-red text-xl">⚠ ENGINE_FAILURE</div>
            <div className="text-[10px] text-white/40 tracking-[0.2em] font-mono leading-relaxed mt-4">
              HARDWARE ACCELERATION / WEBGL CONTEXT LOST<br/>
              ATTEMPTING RECOVERY...
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 border border-white/20 text-[10px] text-white/60 hover:bg-white/5 font-mono mt-4"
            >
              [ REBOOT_SYSTEM ]
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function GlobeCanvas({ targetLocation, onAssetCountChange, showVessels = true }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetCount, setAssetCount] = useState(0); // State to hold the asset count

  // Esc key listener to reset view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedAsset(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pass the setAssetCount function to GlobeScene
  const handleAssetCountChange = (count) => {
    setAssetCount(count);
    if (onAssetCountChange) {
      onAssetCountChange(count);
    }
  };

  return (
    <div className="relative w-full h-full cursor-crosshair">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <GlobeScene
              onMarkerSelect={setSelectedAsset}
              selectedAsset={selectedAsset}
              targetLocation={targetLocation}
              onAssetCountChange={handleAssetCountChange} // Use the local handler
              showVessels={showVessels}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Optional HUD overly for when an asset is clicked */}
      {selectedAsset && (
        <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="glass-panel-solid px-4 py-2 flex flex-col items-center">
            <span className="text-[10px] text-cyan tracking-widest font-bold mb-1">{selectedAsset.id}</span>
            <span className="text-[8px] text-white/50 tracking-wider uppercase">{selectedAsset.type} — {selectedAsset.status}</span>
            <div className="flex gap-3 text-[7px] text-amber/60 mt-1">
              <span>LAT {selectedAsset.lat.toFixed(4)}</span>
              <span>LON {selectedAsset.lon.toFixed(4)}</span>
            </div>
            <div className="flex gap-3 text-[7px] text-cyan/60 mt-0.5">
              <span>SPD {selectedAsset.speed.toFixed(1)} KTS</span>
              <span>HDG {selectedAsset.heading.toFixed(0)}°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
