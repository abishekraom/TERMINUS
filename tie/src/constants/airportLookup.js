/**
 * Top 50 cargo airports — ICAO → { name, lat, lon }
 * Used for FAA NOTAM coordinate fallback when coordinates are null.
 * PRD §10 — airportLookup.js
 */
const AIRPORT_LOOKUP = {
  // North America
  MEM: { name: 'Memphis International', lat: 35.0424, lon: -89.9767 },
  ANC: { name: 'Ted Stevens Anchorage International', lat: 61.1744, lon: -149.9964 },
  SDF: { name: 'Louisville Muhammad Ali International', lat: 38.1744, lon: -85.7360 },
  LAX: { name: 'Los Angeles International', lat: 33.9425, lon: -118.4081 },
  MIA: { name: 'Miami International', lat: 25.7959, lon: -80.2870 },
  JFK: { name: 'John F. Kennedy International', lat: 40.6413, lon: -73.7781 },
  ORD: { name: "Chicago O'Hare International", lat: 41.9742, lon: -87.9073 },
  DFW: { name: 'Dallas/Fort Worth International', lat: 32.8998, lon: -97.0403 },
  ATL: { name: 'Hartsfield-Jackson Atlanta International', lat: 33.6407, lon: -84.4277 },
  CVG: { name: 'Cincinnati/Northern Kentucky International', lat: 39.0488, lon: -84.6678 },
  IND: { name: 'Indianapolis International', lat: 39.7173, lon: -86.2944 },
  ONT: { name: 'Ontario International', lat: 34.0560, lon: -117.6012 },
  // Europe
  FRA: { name: 'Frankfurt am Main', lat: 50.0379, lon: 8.5622 },
  CDG: { name: 'Paris Charles de Gaulle', lat: 49.0097, lon: 2.5479 },
  AMS: { name: 'Amsterdam Schiphol', lat: 52.3086, lon: 4.7639 },
  LHR: { name: 'London Heathrow', lat: 51.4775, lon: -0.4614 },
  LGG: { name: 'Liège Airport', lat: 50.6374, lon: 5.4432 },
  BRU: { name: 'Brussels Airport', lat: 50.9010, lon: 4.4844 },
  MXP: { name: 'Milan Malpensa', lat: 45.6306, lon: 8.7281 },
  MAD: { name: 'Madrid Barajas', lat: 40.4936, lon: -3.5668 },
  // Asia
  HKG: { name: 'Hong Kong International', lat: 22.3080, lon: 113.9185 },
  PVG: { name: 'Shanghai Pudong International', lat: 31.1434, lon: 121.8052 },
  ICN: { name: 'Incheon International', lat: 37.4602, lon: 126.4407 },
  NRT: { name: 'Tokyo Narita International', lat: 35.7720, lon: 140.3929 },
  PEK: { name: 'Beijing Capital International', lat: 40.0799, lon: 116.6031 },
  SIN: { name: 'Singapore Changi', lat: 1.3644, lon: 103.9915 },
  BKK: { name: 'Suvarnabhumi Airport', lat: 13.6900, lon: 100.7501 },
  DEL: { name: 'Indira Gandhi International', lat: 28.5562, lon: 77.1000 },
  BOM: { name: 'Chhatrapati Shivaji Maharaj International', lat: 19.0896, lon: 72.8656 },
  CGK: { name: 'Soekarno-Hatta International', lat: -6.1256, lon: 106.6559 },
  KUL: { name: 'Kuala Lumpur International', lat: 2.7456, lon: 101.7099 },
  MNL: { name: 'Ninoy Aquino International', lat: 14.5086, lon: 121.0195 },
  TPE: { name: 'Taiwan Taoyuan International', lat: 25.0777, lon: 121.2328 },
  CTU: { name: 'Chengdu Shuangliu International', lat: 30.5785, lon: 103.9466 },
  SZX: { name: 'Shenzhen Bao\'an International', lat: 22.6393, lon: 113.8108 },
  // Middle East & Africa
  DXB: { name: 'Dubai International', lat: 25.2532, lon: 55.3657 },
  DOH: { name: 'Hamad International', lat: 25.2609, lon: 51.6138 },
  AUH: { name: 'Abu Dhabi International', lat: 24.4330, lon: 54.6511 },
  CAI: { name: 'Cairo International', lat: 30.1219, lon: 31.4056 },
  JNB: { name: 'O.R. Tambo International', lat: -26.1367, lon: 28.2411 },
  NBO: { name: 'Jomo Kenyatta International', lat: -1.3192, lon: 36.9275 },
  ADD: { name: 'Addis Ababa Bole International', lat: 8.9779, lon: 38.7993 },
  // Latin America
  GRU: { name: 'São Paulo/Guarulhos International', lat: -23.4356, lon: -46.4731 },
  BOG: { name: 'El Dorado International', lat: 4.7016, lon: -74.1469 },
  LIM: { name: 'Jorge Chávez International', lat: -12.0219, lon: -77.1143 },
  MEX: { name: 'Mexico City International', lat: 19.4363, lon: -99.0721 },
  // Oceania
  SYD: { name: 'Sydney Kingsford Smith', lat: -33.9399, lon: 151.1753 },
  MEL: { name: 'Melbourne Airport', lat: -37.6690, lon: 144.8410 },
  BNE: { name: 'Brisbane Airport', lat: -27.3842, lon: 153.1175 },
};

module.exports = { AIRPORT_LOOKUP };
