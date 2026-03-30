const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');
const config = require('../config');

// 20 Chokepoints
const CHOKEPOINTS = [
  { id: 'malacca', name: 'Strait of Malacca', lat: 3.2, lon: 101.3 },
  { id: 'suez-n', name: 'Suez Canal (North)', lat: 31.2, lon: 32.3 },
  { id: 'suez-s', name: 'Suez Canal (South)', lat: 29.9, lon: 32.5 },
  { id: 'hormuz', name: 'Strait of Hormuz', lat: 26.5, lon: 56.2 },
  { id: 'babelmandeb', name: 'Bab-el-Mandeb', lat: 12.5, lon: 43.3 },
  { id: 'panama-n', name: 'Panama Canal (North)', lat: 9.3, lon: -79.9 },
  { id: 'panama-s', name: 'Panama Canal (South)', lat: 8.9, lon: -79.5 },
  { id: 'capeofgoodhope', name: 'Cape of Good Hope', lat: -34.3, lon: 18.4 },
  { id: 'englishchannel', name: 'English Channel', lat: 50.0, lon: -1.0 },
  { id: 'doverstrait', name: 'Dover Strait', lat: 51.0, lon: 1.5 },
  { id: 'lombok', name: 'Lombok Strait', lat: -8.8, lon: 115.7 },
  { id: 'sunda', name: 'Sunda Strait', lat: -6.0, lon: 105.8 },
  { id: 'bosphorus', name: 'Bosphorus', lat: 41.2, lon: 29.1 },
  { id: 'dardanelles', name: 'Dardanelles', lat: 40.2, lon: 26.4 },
  { id: 'gibraltar', name: 'Gibraltar', lat: 35.9, lon: -5.5 },
  { id: 'taiwan', name: 'Taiwan Strait', lat: 24.0, lon: 119.0 },
  { id: 'luzon', name: 'Luzon Strait', lat: 20.0, lon: 121.0 },
  { id: 'torres', name: 'Torres Strait', lat: -10.0, lon: 142.5 },
  { id: 'bass', name: 'Bass Strait', lat: -39.0, lon: 145.0 },
  { id: 'skagerrak', name: 'Skagerrak', lat: 57.8, lon: 9.0 }
];

async function fetchOwm() {
  if (!config.owm.apiKey) return;
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'OWM', scheduledIntervalMs: 45000 });

  for (const cp of CHOKEPOINTS) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cp.lat}&lon=${cp.lon}&appid=${config.owm.apiKey}&units=metric`;
    try {
      const res = await request(url);
      const w = await res.body.json();

      let severity = 0;
      let reason = '';

      if (w.wind?.speed > 32.7) { severity = 5; reason = 'Hurricane force winds'; }
      else if (w.wind?.gust > 32.7) { severity = 5; reason = 'Hurricane force wind gusts'; }
      else if (w.wind?.speed > 24.5) { severity = 4; reason = 'Storm force winds'; }
      else if (w.wind?.speed > 17.2) { severity = 3; reason = 'Gale force winds'; }
      
      const weatherId = w.weather && w.weather[0]?.id;
      if (weatherId >= 900 && weatherId <= 902) { severity = Math.max(severity, 5); reason += ' Extreme weather.'; }
      else if (w.main?.pressure < 960) { severity = Math.max(severity, 4); reason += ' Low pressure (cyclone).'; }
      else if (weatherId >= 200 && weatherId <= 232) { severity = Math.max(severity, 3); reason += ' Thunderstorm.'; }
      else if (w.visibility < 1000) { severity = Math.max(severity, 3); reason += ' Low visibility (fog).'; }

      if (severity >= 3) {
        logger.warn({
          event: 'WEATHER_THRESHOLD_BREACH',
          chokepoint: cp.name,
          lat: cp.lat,
          lon: cp.lon,
          parameter: 'composite',
          severityTriggered: severity,
          value: w.wind?.speed,
        });

        const dedupKey = `${cp.id}_${w.dt}`;

        const title = `Extreme Weather Alert: ${reason.trim()} at ${cp.name}`;
        
        await processEvent({
          provider: 'OWM',
          dedupKey,
          dedupTtlMinutes: 1, // 60s
          title,
          content: `Real-time weather observation at ${cp.name}: Wind ${w.wind?.speed} m/s, Gusts ${w.wind?.gust||0} m/s, Visibility ${w.visibility}m, Pressure ${w.main?.pressure} hPa, Conditions: ${w.weather[0]?.description}.`,
          url: '',
          fetchedAt: new Date().toISOString(),
          rawApiResponse: w,
          additionalContext: { chokepoint: cp.name, lat: cp.lat, lon: cp.lon },
          forceScrape: false
        });
      }

    } catch (err) {
      logger.error({ err, source: 'OWM', chokepoint: cp.name }, 'OWM fetch failed');
    }
  }

  logger.debug({
    event: 'SOURCE_FETCH_COMPLETE',
    source: 'OWM',
    fetchLatencyMs: Date.now() - start
  });
}

module.exports = { fetchOwm };
