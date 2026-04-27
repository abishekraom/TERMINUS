import { useEffect } from 'react';
import ShipMarker from './ShipMarker';
import AircraftMarker from './AircraftMarker';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { WS_URL } from '../config';

/**
 * VesselLayer
 * 
 * Orchestrates real-time vessel and aircraft rendering on the globe.
 * Now delegates data fetching to telemetryWorker and reads lengths from Zustand
 * to report assetCount, while the markers read coordinates directly from store.
 */
export default function VesselLayer({ 
  selectedId, 
  getCoordinatesFromLatLng, 
  onMarkerClick, 
  onAssetCountChange,
  layerStates,
  density = 50
}) {
  const vesselsCount = useTelemetryStore(state => state.vessels.length);
  const aircraftCount = useTelemetryStore(state => state.aircraft.length);

  useEffect(() => {
    console.log('[VesselLayer] Spawning telemetry worker');
    const worker = new Worker(new URL('../workers/telemetryWorker.js', import.meta.url), { type: 'module' });

    worker.onmessage = (e) => {
      if (e.data.type === 'TELEMETRY_UPDATE') {
        useTelemetryStore.getState().setTelemetry(e.data.payload);
      } else if (e.data.type === 'STATUS') {
        useTelemetryStore.getState().setStatus(e.data.payload);
      }
    };

    worker.postMessage({ type: 'INIT', payload: { wsUrl: WS_URL } });

    return () => {
      console.log('[VesselLayer] Terminating telemetry worker');
      worker.terminate();
    };
  }, []);

  // Notify parent of combined asset count
  useEffect(() => {
    if (onAssetCountChange) {
      const showVessels = layerStates?.vessels !== false;
      const showAircraft = layerStates?.aircraft !== false;
      const count = (showVessels ? vesselsCount : 0) + (showAircraft ? aircraftCount : 0);
      onAssetCountChange(count);
    }
  }, [vesselsCount, aircraftCount, layerStates, onAssetCountChange]);

  const showVessels = layerStates?.vessels !== false;
  const showAircraft = layerStates?.aircraft !== false;

  return (
    <>
      {showVessels && vesselsCount > 0 && (
        <ShipMarker
          selectedId={selectedId}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
          onMarkerClick={onMarkerClick}
        />
      )}

      {showAircraft && aircraftCount > 0 && (
        <AircraftMarker
          selectedId={selectedId}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
          onMarkerClick={onMarkerClick}
        />
      )}
    </>
  );
}
