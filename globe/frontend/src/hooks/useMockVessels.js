import { useState, useEffect } from 'react';
import { VESSEL_DATA } from '../data/mockData';

const INITIAL_VESSELS = VESSEL_DATA.map(v => {
  // Create a seeded random based on ID roughly
  const seed = v.id.charCodeAt(0) + (v.id.charCodeAt(v.id.length - 1) || 0);
  const randomHeading = (seed * 47) % 360; 

  return {
    ...v,
    lat: parseFloat(v.lat),
    lon: parseFloat(v.lon),
    speed: parseFloat(v.speed) || 12,
    heading: randomHeading,
  };
}).filter(v => !isNaN(v.lat) && !isNaN(v.lon));

export function useMockVessels() {
  const [vessels, setVessels] = useState(INITIAL_VESSELS);

  useEffect(() => {
    // Update the simulation state at 1 Hz to prevent excessive React re-renders
    const interval = setInterval(() => {
      setVessels(prev => prev.map(v => {
        // We simulate movement for 1 second (deltaTime = 1)
        const speedFactor = 0.02; // degree change per second per unit of speed
        
        let newLat = v.lat + (Math.cos(v.heading * (Math.PI / 180)) * v.speed * speedFactor);
        let newLon = v.lon + (Math.sin(v.heading * (Math.PI / 180)) * v.speed * speedFactor);
        
        // Looping paths (wrap around the globe)
        if (newLat > 90) newLat -= 180;
        if (newLat < -90) newLat += 180;
        if (newLon > 180) newLon -= 360;
        if (newLon < -180) newLon += 360;

        // Slight randomness in movement to simulate shifting course
        const headingShift = (Math.random() - 0.5) * 5; // Max 5 deg shift per sec
        let newHeading = v.heading + headingShift;
        if (newHeading >= 360) newHeading -= 360;
        if (newHeading < 0) newHeading += 360;

        return {
          ...v,
          lat: newLat,
          lon: newLon,
          heading: newHeading
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return vessels;
}
