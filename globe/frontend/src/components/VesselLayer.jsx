import { useEffect } from 'react';
import Markers from './Markers';
import { useMockVessels } from '../hooks/useMockVessels';

export default function VesselLayer({ selectedId, getCoordinatesFromLatLng, onMarkerClick, onAssetCountChange }) {
  const vessels = useMockVessels();

  // Notify parent of asset count changes whenever vessels array length changes
  // We use vessels.length as a dependency because the mock hook might add/remove items later,
  // or just on initial load.
  useEffect(() => {
    if (onAssetCountChange) {
      onAssetCountChange(vessels.length);
    }
  }, [vessels.length, onAssetCountChange]);

  if (!vessels || vessels.length === 0) return null;

  return (
    <Markers 
      data={vessels}
      selectedId={selectedId}
      getCoordinatesFromLatLng={getCoordinatesFromLatLng}
      onMarkerClick={onMarkerClick}
    />
  );
}
