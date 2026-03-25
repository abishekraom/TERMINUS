import Header from './Header';
import DataLayersPanel from './DataLayersPanel';
import ControlsPanel from './ControlsPanel';
import GlobeCanvas from './GlobeCanvas';
import ViewModeSelector from './ViewModeSelector';
import InfoOverlays from './InfoOverlays';
import { useState } from 'react';

export default function AppLayout() {
  const [zoomTarget, setZoomTarget] = useState(null);
  const [activeMode, setActiveMode] = useState('crt');
  const [assetCount, setAssetCount] = useState(0);
  const [showVessels, setShowVessels] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black relative">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Globe / Center (fullscreen behind panels) */}
        <div className="absolute inset-0">
          <GlobeCanvas targetLocation={zoomTarget} onAssetCountChange={setAssetCount} showVessels={showVessels} />
        </div>

        {/* Scanlines Overlay */}
        <div className="scanlines-overlay" />

        {/* Info Overlays */}
        <InfoOverlays />

        {/* Left Panel — Data Layers */}
        <div className="absolute bottom-6 left-6 z-30">
          <DataLayersPanel onToggleVessels={setShowVessels} />
        </div>

        {/* Right Panel — Controls */}
        <div className="absolute bottom-6 right-6 z-30">
          <ControlsPanel assetCount={assetCount} />
        </div>

        {/* Bottom Area: Integrates View Modes & Terminal */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
          <ViewModeSelector activeMode={activeMode} setActiveMode={setActiveMode} />
        </div>
      </div>
    </div>
  );
}
