import React from 'react';

export default function DebugLayer({ getCoordinatesFromLatLng }) {
  const points = [
    { name: 'Null Island', lat: 0, lon: 0, color: '#ff0044' },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: '#00ccff' },
    { name: 'NYC', lat: 40.7128, lon: -74.0060, color: '#00ff44' }
  ];

  return (
    <group>
      {points.map((pt, i) => {
        const pos = getCoordinatesFromLatLng(pt.lat, pt.lon, 1.01);
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color={pt.color} />
          </mesh>
        );
      })}
    </group>
  );
}
