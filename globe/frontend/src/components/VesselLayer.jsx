import { useEffect, useMemo } from 'react';
import ShipMarker from './ShipMarker';
import AircraftMarker from './AircraftMarker';
import { useBackendData } from '../hooks/useBackendData';

/**
 * VesselLayer
 * 
 * Orchestrates real-time vessel and aircraft rendering on the globe.
 * Reads from the VDIE backend API via useBackendData and renders two separate
 * InstancedMesh groups with distinct visual styles:
 *   - Ships: cyan glowing spheres (ShipMarker)
 *   - Aircraft: orange glowing cones with heading rotation (AircraftMarker)
 * 
 * Respects layerStates toggles to show/hide each type independently.
 */
export default function VesselLayer({ 
  selectedId, 
  getCoordinatesFromLatLng, 
  onMarkerClick, 
  onAssetCountChange,
  layerStates,
  density = 50
}) {
  const { vessels, aircraft, loading, error, connectionStatus } = useBackendData();
  
  // Filter vessels - scatter them geographically instead of showing clustered ones
  const filteredVessels = useMemo(() => {
    if (!vessels.length) return [];
    
    // For scatter mode: filter to show distributed vessels across the globe
    // Divide world into grid cells and select one from each
    const gridSize = 10; // 10x10 grid = 100 cells
    const cellVessels = new Map();
    
    for (const v of vessels) {
      // Calculate grid cell based on lat/lon
      const latCell = Math.floor((v.lat + 90) / 180 * gridSize);
      const lonCell = Math.floor((v.lon + 180) / 360 * gridSize);
      const cellKey = `${latCell}-${lonCell}`;
      
      // Keep first vessel in each cell (spreads them out)
      if (!cellVessels.has(cellKey)) {
        cellVessels.set(cellKey, v);
      }
    }
    
    let scatteredVessels = Array.from(cellVessels.values());
    
    // Then apply density filter
    const targetCount = Math.ceil(scatteredVessels.length * (density / 100));
    if (targetCount >= scatteredVessels.length) return scatteredVessels;
    
    // Sample evenly from scattered
    const step = Math.max(1, Math.floor(scatteredVessels.length / targetCount));
    return scatteredVessels.filter((_, i) => i % step === 0);
  }, [vessels, density]);

  const filteredAircraft = useMemo(() => {
    if (!aircraft.length) return [];
    
    // Same scatter logic for aircraft
    const gridSize = 10;
    const cellVessels = new Map();
    
    for (const a of aircraft) {
      const latCell = Math.floor((a.lat + 90) / 180 * gridSize);
      const lonCell = Math.floor((a.lon + 180) / 360 * gridSize);
      const cellKey = `${latCell}-${lonCell}`;
      
      if (!cellVessels.has(cellKey)) {
        cellVessels.set(cellKey, a);
      }
    }
    
    let scatteredAircraft = Array.from(cellVessels.values());
    
    const targetCount = Math.ceil(scatteredAircraft.length * (density / 100));
    if (targetCount >= scatteredAircraft.length) return scatteredAircraft;
    
    const step = Math.max(1, Math.floor(scatteredAircraft.length / targetCount));
    return scatteredAircraft.filter((_, i) => i % step === 0);
  }, [aircraft, density]);
  
  console.log('[VesselLayer] vessels:', filteredVessels.length, 'aircraft:', filteredAircraft.length, 'loading:', loading);

  // Notify parent of combined asset count
  useEffect(() => {
    if (onAssetCountChange) {
      const showVessels = layerStates?.vessels !== false;
      const showAircraft = layerStates?.aircraft !== false;
      const count = (showVessels ? filteredVessels.length : 0) + (showAircraft ? filteredAircraft.length : 0);
      console.log('[VesselLayer] onAssetCountChange:', count);
      onAssetCountChange(count);
    }
  }, [filteredVessels.length, filteredAircraft.length, layerStates, onAssetCountChange]);

  if (loading && vessels.length === 0 && aircraft.length === 0) return null;

  const showVessels = layerStates?.vessels !== false;
  const showAircraft = layerStates?.aircraft !== false;

  return (
    <>
      {showVessels && filteredVessels.length > 0 && (
        <ShipMarker
          data={filteredVessels}
          selectedId={selectedId}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
          onMarkerClick={onMarkerClick}
        />
      )}

      {showAircraft && filteredAircraft.length > 0 && (
        <AircraftMarker
          data={filteredAircraft}
          selectedId={selectedId}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
          onMarkerClick={onMarkerClick}
        />
      )}
    </>
  );
}
