import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Earth from './Earth';
import VesselLayer from './VesselLayer';
import ThreatLayer from './ThreatLayer';
import TrackLayer from './TrackLayer';
import { useGlobeControls } from '../hooks/useGlobeControls';
import { useThreatsData } from '../hooks/useThreatsData';
import { useTrackData } from '../hooks/useTrackData';

// We extract the inner scene into its own component to use the useGlobeControls hook
// which requires the <Canvas> context to be already established.
function GlobeScene({ onMarkerSelect, selectedAsset, targetLocation, onAssetCountChange, layerStates, density }) {
  const { controlsRef, zoomToLocation, resetView, getCoordinatesFromLatLng } = useGlobeControls(selectedAsset);
  const { threats } = useThreatsData(layerStates?.threats);
  const { track } = useTrackData(selectedAsset?.id);

  const [isRotating, setIsRotating] = useState(true);

  const handleMarkerClick = (marker) => {
    console.log('[handleMarkerClick] marker clicked:', marker);
    // If clicking the same marker, toggle it off
    if (selectedAsset && selectedAsset.id === marker.id) {
      console.log('[handleMarkerClick] same marker, deselecting');
      if (onMarkerSelect) onMarkerSelect(null);
      return;
    }

    // Zoom to the marker and select it
    console.log('[handleMarkerClick] zooming to:', marker.lat, marker.lon);
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

      <VesselLayer
        selectedId={selectedAsset?.id}
        getCoordinatesFromLatLng={getCoordinatesFromLatLng}
        onMarkerClick={handleMarkerClick}
        onAssetCountChange={onAssetCountChange}
        layerStates={layerStates}
        density={density}
      />

      {layerStates?.threats && (
        <ThreatLayer
          threats={threats}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
        />
      )}

      {selectedAsset && (
        <TrackLayer
          track={track}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
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

export default function GlobeCanvas({ targetLocation, onAssetCountChange, layerStates, density }) {
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
              layerStates={layerStates}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Optional HUD overly for when an asset is clicked */}
      {selectedAsset && (
        <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="glass-panel-solid px-5 py-3 flex flex-col items-center min-w-[220px]">
            {/* Type Badge */}
            <span className={`text-[7px] tracking-[0.25em] font-bold px-2.5 py-0.5 mb-1.5 border ${
              selectedAsset.type === 'aircraft'
                ? 'text-amber border-amber/40 bg-amber/10'
                : 'text-cyan border-cyan/40 bg-cyan/10'
            }`}>
              {selectedAsset.type === 'aircraft' ? '✈ AIRCRAFT' : '🚢 VESSEL'}
            </span>
            {/* Name */}
            <span className={`text-[11px] tracking-widest font-bold mb-0.5 ${
              selectedAsset.type === 'aircraft' ? 'text-amber' : 'text-cyan'
            }`}>
              {selectedAsset.name || selectedAsset.id}
            </span>
            {/* ID */}
            <span className="text-[8px] text-white/40 tracking-wider font-mono mb-1">
              {selectedAsset.id}
            </span>
            {/* Status */}
            <span className="text-[8px] text-white/50 tracking-wider uppercase">
              {selectedAsset.status || 'ACTIVE'}
            </span>
            {/* Coordinates */}
            <div className="flex gap-3 text-[7px] text-amber/60 mt-1.5">
              <span>LAT {(selectedAsset.lat ?? 0).toFixed(4)}</span>
              <span>LON {(selectedAsset.lon ?? 0).toFixed(4)}</span>
            </div>
            {/* Speed + Heading */}
            <div className={`flex gap-3 text-[7px] mt-0.5 ${
              selectedAsset.type === 'aircraft' ? 'text-amber/60' : 'text-cyan/60'
            }`}>
              <span>SPD {(selectedAsset.speed ?? 0).toFixed(1)} {selectedAsset.type === 'aircraft' ? 'KPH' : 'KTS'}</span>
              <span>HDG {(selectedAsset.heading ?? 0).toFixed(0)}°</span>
            </div>
            {/* Source badge */}
            {selectedAsset.source && (
              <span className="mt-1.5 text-[6px] tracking-[0.2em] text-white/30 border border-white/10 px-2 py-0.5">
                {selectedAsset.source}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
