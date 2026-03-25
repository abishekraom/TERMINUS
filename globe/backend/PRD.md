# PRD-01: Vessel Data Ingestion Engine (VDIE)

**Document Version:** 1.0.0
**Engine Codename:** `vdie`
**Last Updated:** 2026-03-20

---

## 1. Overview

The Vessel Data Ingestion Engine is a stateful Node.js microservice responsible for maintaining persistent connections to AISStream.io (WebSocket) and OpenSky Network (REST poll), normalizing all raw API payloads into a unified internal `VesselState` schema, and broadcasting that state simultaneously to Firebase Realtime DB (primary), an internal WebSocket server (backup transport B), and a REST snapshot endpoint (backup transport C). It also exposes a Level-of-Detail (LOD) control API that the frontend slider uses to reduce or expand the visible vessel set.

---

## 2. Tech Stack

| Layer              | Technology                            | Justification                                                                   |
| ------------------ | ------------------------------------- | ------------------------------------------------------------------------------- |
| Runtime            | Node.js 20 LTS                        | Native async, best WebSocket ecosystem                                          |
| Framework          | Fastify 4.x                           | 3× faster than Express, built-in schema validation, structured logging via pino |
| WebSocket Client   | `ws` library 8.x                      | Handles AISStream persistent connection with auto-reconnect                     |
| HTTP Client        | `undici` (Node built-in)              | Fastest Node HTTP client, used for OpenSky polling                              |
| Firebase Admin SDK | `firebase-admin` 12.x                 | Server-side writes to Realtime DB + Firestore                                   |
| WebSocket Server   | `@fastify/websocket`                  | Backup transport B                                                              |
| Logging            | `pino` + `pino-pretty`                | JSON in prod, colored human-readable in dev                                     |
| Containerization   | Docker + `docker-compose`             | Local deployment per Q2                                                         |
| Auth               | Shared API key via `x-api-key` header | Per Q12                                                                         |

---

## 3. AISStream.io — Complete Field Reference

### 3.1 Connection & Subscription

```js
// WebSocket endpoint
wss://stream.aisstream.io/v0/stream

// Subscription message sent on connect
{
  "APIKey": process.env.AISSTREAM_API_KEY,
  "BoundingBoxes": [[[-90, -180], [90, 180]]],  // global
  "FilterMessageTypes": [
    "PositionReport",
    "ShipStaticData",
    "StandardClassBPositionReport",
    "AidToNavigationReport"
  ]
}
```

### 3.2 Message Type: `PositionReport` (Class A — cargo ships, tankers, large vessels)

Every 2–10 seconds per vessel when underway.

**ALL fields returned:**

| Field                                              | Type   | Description                                         |
| -------------------------------------------------- | ------ | --------------------------------------------------- |
| `MessageType`                                      | string | Always `"PositionReport"`                           |
| `MetaData.MMSI`                                    | int    | Duplicate of UserID, added by AISStream             |
| `MetaData.ShipName`                                | string | Vessel name (AISStream enrichment)                  |
| `MetaData.latitude`                                | float  | Latest latitude (AISStream enrichment)              |
| `MetaData.longitude`                               | float  | Latest longitude (AISStream enrichment)             |
| `MetaData.time_utc`                                | string | UTC receipt timestamp (ISO-8601)                    |
| `Message.PositionReport.MessageID`                 | int    | AIS message type ID (always 1, 2, or 3)             |
| `Message.PositionReport.UserID`                    | int    | MMSI — 9-digit vessel identifier                    |
| `Message.PositionReport.Latitude`                  | float  | WGS-84 latitude (-90 to 90)                         |
| `Message.PositionReport.Longitude`                 | float  | WGS-84 longitude (-180 to 180)                      |
| `Message.PositionReport.Sog`                       | float  | Speed Over Ground in knots (0–102.2)                |
| `Message.PositionReport.Cog`                       | float  | Course Over Ground in degrees (0–359.9)             |
| `Message.PositionReport.TrueHeading`               | int    | Compass heading (0–359), 511 = unavailable          |
| `Message.PositionReport.RateOfTurn`                | int    | Turn rate deg/min (-127 to 127), -128 = unavailable |
| `Message.PositionReport.NavigationalStatus`        | int    | 0–15 operational state code                         |
| `Message.PositionReport.PositionAccuracy`          | bool   | true = GPS < 10m accuracy                           |
| `Message.PositionReport.Raim`                      | bool   | GPS self-integrity check                            |
| `Message.PositionReport.Timestamp`                 | int    | Second within GPS minute (0–59)                     |
| `Message.PositionReport.ManeuverIndicator`         | int    | 0=N/A, 1=special manoeuvre, 2=special manoeuvre     |
| `Message.PositionReport.Spare`                     | int    | Reserved bits, always ignore                        |
| `Message.PositionReport.RepeatIndicator`           | int    | Number of times msg has been repeated               |
| `Message.PositionReport.CommunicationStateIsItdma` | bool   | Radio state type flag                               |
| `Message.PositionReport.CommunicationState`        | int    | Radio sync state, ignore                            |

**Fields VDIE actually uses:**

```
MMSI                    → vessel primary key
ShipName (MetaData)     → display label
latitude / longitude    → globe position
Sog                     → ETA calculation + anomaly detection
Cog                     → dead-reckoning projection + direction arrow
TrueHeading             → vessel orientation rendering (fallback to Cog if 511)
RateOfTurn              → anomaly trigger (|value| > 60 = sharp turn alert)
NavigationalStatus      → operational state filtering (anchored/moored vs. underway)
PositionAccuracy        → data quality flag
Timestamp + time_utc    → staleness check (drop if > 120s old)
ManeuverIndicator       → alert trigger
```

---

### 3.3 Message Type: `ShipStaticData` (Class A — sent every 6 minutes)

**ALL fields returned:**

| Field                                         | Type   | Description                                       |
| --------------------------------------------- | ------ | ------------------------------------------------- |
| `MetaData.MMSI`                               | int    | AISStream enrichment                              |
| `MetaData.ShipName`                           | string | AISStream enrichment                              |
| `MetaData.time_utc`                           | string | Receipt timestamp                                 |
| `Message.ShipStaticData.MessageID`            | int    | AIS type (always 5)                               |
| `Message.ShipStaticData.UserID`               | int    | MMSI                                              |
| `Message.ShipStaticData.ImoNumber`            | int    | Permanent IMO vessel ID                           |
| `Message.ShipStaticData.CallSign`             | string | 7-char radio callsign                             |
| `Message.ShipStaticData.Name`                 | string | Official vessel name (up to 20 chars)             |
| `Message.ShipStaticData.Type`                 | int    | Vessel type code (see type table below)           |
| `Message.ShipStaticData.Destination`          | string | Next port, free-text, up to 20 chars              |
| `Message.ShipStaticData.Eta`                  | object | `{Month, Day, Hour, Minute}` self-reported        |
| `Message.ShipStaticData.MaximumStaticDraught` | float  | Draft in metres (0.1–25.5)                        |
| `Message.ShipStaticData.Dimension`            | object | `{A, B, C, D}` bow/stern/port/starboard in metres |
| `Message.ShipStaticData.FixType`              | int    | GPS type: 1=GPS, 3=combined, 7=surveyed           |
| `Message.ShipStaticData.DteNotReady`          | bool   | Data Terminal Equipment flag                      |
| `Message.ShipStaticData.AisVersion`           | int    | AIS transponder version                           |
| `Message.ShipStaticData.RepeatIndicator`      | int    | Relay count                                       |
| `Message.ShipStaticData.Spare`                | bool   | Reserved, ignore                                  |
| `Message.ShipStaticData.Assigned`             | bool   | TDMA assignment flag                              |

**Vessel Type Codes used by VDIE (filter others out):**

```
70–79 → Cargo ships       ← TRACK
80–89 → Tankers            ← TRACK
50    → Pilot vessel       ← TRACK
51    → SAR aircraft       ← TRACK (for incident detection)
35    → Military ops       ← SKIP (per scope decision)
30    → Fishing            ← SKIP
```

**Fields VDIE uses:**

```
ImoNumber               → permanent unique ID (stored in Firestore vessel profile)
Name                    → vessel display name
Type                    → vessel category filter + icon selector
Destination             → parsed + geocoded → target port coordinates
Eta                     → self-reported ETA (stored, compared against calculated ETA)
MaximumStaticDraught    → routing constraint (shallow strait avoidance)
Dimension.A + .B        → vessel length = A + B, used for port capacity alerts
```

---

### 3.4 Message Type: `StandardClassBPositionReport` (smaller vessels, Class B transponders)

| Field              | Type  | Notes                |
| ------------------ | ----- | -------------------- |
| `UserID`           | int   | MMSI                 |
| `Latitude`         | float | Position             |
| `Longitude`        | float | Position             |
| `Sog`              | float | Speed in knots       |
| `Cog`              | float | Course               |
| `TrueHeading`      | int   | Heading              |
| `PositionAccuracy` | bool  | GPS quality          |
| `CsUnit`           | bool  | Class B CS unit flag |
| `Display`          | bool  | Has display device   |
| `Dsc`              | bool  | DSC capability       |
| `Band`             | bool  | Band flag            |
| `Msg22`            | bool  | Message 22 flag      |
| `Assigned`         | bool  | Assigned flag        |
| `Raim`             | bool  | GPS integrity        |
| `Timestamp`        | int   | GPS second           |

VDIE uses: `UserID`, `Latitude`, `Longitude`, `Sog`, `Cog`, `TrueHeading` — same normalization as PositionReport.

---

## 4. OpenSky Network — Complete Field Reference

### 4.1 Polling Configuration

```
Endpoint:  GET https://opensky-network.org/api/states/all
Auth:      OAuth2 Bearer Token (rotate every 30 min — token expires)
Interval:  Every 30 seconds
Scope:     Filter to on_ground == false AND category IN [4, 5] (large/heavy cargo)
```

### 4.2 State Vector — `states` Array

Each element of `states` is a positional array (not a named object):

| Index | Field Name        | Type        | Description                                                                                        |
| ----- | ----------------- | ----------- | -------------------------------------------------------------------------------------------------- |
| 0     | `icao24`          | string      | Unique hex ICAO transponder address                                                                |
| 1     | `callsign`        | string      | Flight number, e.g. "SQ321" (may be null or padded with spaces)                                    |
| 2     | `origin_country`  | string      | Country of registration inferred from ICAO block                                                   |
| 3     | `time_position`   | int/null    | Unix timestamp of last GPS position fix                                                            |
| 4     | `last_contact`    | int         | Unix timestamp of last signal received                                                             |
| 5     | `longitude`       | float/null  | WGS-84 longitude                                                                                   |
| 6     | `latitude`        | float/null  | WGS-84 latitude                                                                                    |
| 7     | `baro_altitude`   | float/null  | Barometric altitude in metres                                                                      |
| 8     | `on_ground`       | bool        | True = surface contact detected                                                                    |
| 9     | `velocity`        | float/null  | Ground speed in **m/s**                                                                            |
| 10    | `true_track`      | float/null  | Heading degrees clockwise from north                                                               |
| 11    | `vertical_rate`   | float/null  | Climb/descent rate m/s (positive=climb)                                                            |
| 12    | `sensors`         | int[]/null  | Array of receiver sensor IDs (internal)                                                            |
| 13    | `geo_altitude`    | float/null  | GPS altitude in metres (more accurate than baro)                                                   |
| 14    | `squawk`          | string/null | Transponder squawk code                                                                            |
| 15    | `spi`             | bool        | Special Purpose Indicator                                                                          |
| 16    | `position_source` | int         | 0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM                                                                |
| 17    | `category`        | int/null    | 0=no info, 1=no ADS-B, 2=light, 3=small, 4=large, 5=high vortex large, 6=heavy, 7=high performance |

**Fields VDIE uses:**

```
icao24              → aircraft primary key
callsign            → display label (trim whitespace)
longitude / latitude → globe position
baro_altitude       → altitude layer (filter < 100m = taxiing, skip)
on_ground           → drop from active tracking if true
velocity            → ETA calculation (m/s × 1.944 = knots)
true_track          → direction arrow + dead-reckoning
vertical_rate       → descent detection (< -5 m/s = approaching destination)
geo_altitude        → 3D globe rendering (preferred over baro)
squawk              → EMERGENCY TRIGGER: 7500/7600/7700
position_source     → data quality: prefer 0 (ADS-B), weight MLAT lower
category            → vessel type filter (4/5/6 = cargo/heavy)
last_contact        → drop if now - last_contact > 120 seconds
```

### 4.3 OpenSky `/tracks` Endpoint — Historical Flight Path

```
GET /tracks/all?icao24=<hex>&time=0   (time=0 = live track)
```

| Field       | Type            | Description                                                       |
| ----------- | --------------- | ----------------------------------------------------------------- |
| `icao24`    | string          | Aircraft identifier                                               |
| `startTime` | int             | Unix timestamp of track start                                     |
| `endTime`   | int             | Unix timestamp of last point                                      |
| `path`      | array of arrays | Each element: `[time, lat, lon, baro_alt, true_track, on_ground]` |

VDIE uses: `path` → render as historical trail polyline in CesiumJS (last 50 waypoints).

---

## 5. Unified Internal `VesselState` Schema

This is the **normalized object** VDIE produces after consuming from either source. Everything downstream (Firebase, WS server, REST endpoint, Route Monitor, Pathfinder) works with this — never with raw API payloads:

```ts
interface VesselState {
  // ── Identity ─────────────────────────────────────────────
  vesselId: string; // "MMSI:<mmsi>" | "ICAO:<icao24>"
  source: "AIS" | "ADSB";
  mmsi?: number; // AIS only
  icao24?: string; // ADS-B only
  imoNumber?: number; // AIS only, from ShipStaticData
  callsign?: string; // AIS callsign or flight number
  name: string; // display name

  // ── Classification ────────────────────────────────────────
  vesselType: VesselCategory; // "CARGO" | "TANKER" | "AIRCRAFT_CARGO" | "AIRCRAFT_HEAVY" | "PILOT" | "SAR" | "UNKNOWN"
  flagCountry?: string; // ISO 3166-1 alpha-2

  // ── Position (always present if valid) ───────────────────
  position: {
    lat: number;
    lon: number;
    altitudeMetres?: number; // aircraft only
    accuracyHigh: boolean; // PositionAccuracy (AIS) | position_source==0 (ADS-B)
    fixTimestampUtc: string; // ISO-8601
  };

  // ── Motion ────────────────────────────────────────────────
  motion: {
    sogKnots: number; // Speed Over Ground
    cogDegrees: number; // Course Over Ground
    headingDegrees: number; // True heading (nullable)
    rateOfTurnDegPerMin?: number; // AIS only
    verticalRateMs?: number; // ADS-B only
    isUnderway: boolean; // derived: NavigationalStatus==0 OR velocity > 0.5
  };

  // ── Destination & ETA ─────────────────────────────────────
  destination?: {
    rawText: string; // e.g. "SGSIN"
    portCode?: string; // normalized e.g. "SGSIN"
    portName?: string; // e.g. "Port of Singapore"
    lat?: number;
    lon?: number;
    selfReportedEta?: string; // ISO-8601 from ShipStaticData
    calculatedEtaUtc?: string; // ISO-8601 derived from Haversine + SOG
    calculatedDistanceNm?: number;
    etaConfidence: "HIGH" | "MEDIUM" | "LOW" | "UNAVAILABLE";
  };

  // ── Physical Profile ─────────────────────────────────────
  dimensions?: {
    lengthMetres?: number; // A + B from ShipStaticData
    beamMetres?: number; // C + D
    draughtMetres?: number; // MaximumStaticDraught
  };

  // ── Operational Status ────────────────────────────────────
  operationalStatus: {
    navStatus: number; // raw AIS status code (AIS only)
    navStatusLabel: string; // human-readable
    isAnchored: boolean;
    isMoored: boolean;
    isUnderway: boolean;
    emergencySquawk?: string; // "7500"|"7700"|"7600" (ADS-B only)
    isEmergency: boolean;
  };

  // ── Trail (ring buffer, last 200 points for AIS, 50 for ADS-B) ──
  trail: Array<{
    lat: number;
    lon: number;
    altMetres?: number;
    timestampUtc: string;
    sogKnots: number;
  }>;

  // ── Dead Reckoning (15-min projection) ───────────────────
  projectedPositions: Array<{
    lat: number;
    lon: number;
    minutesAhead: number; // 5, 10, 15
  }>;

  // ── Threat Exposure (set by Route Monitor) ────────────────
  activeThreatIds: string[]; // threatIds from TIE that intersect this vessel's route
  routeStatus: "CLEAR" | "THREAT_AHEAD" | "REROUTING" | "REROUTED";

  // ── Metadata ──────────────────────────────────────────────
  lastUpdatedUtc: string;
  ingestLatencyMs: number; // time_utc receipt → Firebase write
  dataQuality: "HIGH" | "MEDIUM" | "LOW"; // derived from accuracyHigh + position_source
}
```

---

## 6. LOD (Level-of-Detail) Slider System

The slider at the frontend sends a REST request to VDIE: `POST /lod { count: 200 }`. VDIE applies a **priority scoring system** to select which vessels to include:

```
Priority Score = (isUnderway × 40)
              + (hasActiveThreats × 30)
              + (isOperatorTracked × 20)
              + (dataQuality=="HIGH" × 5)
              + (random jitter 0–5)
```

Higher score = included first. This ensures that at any slider value, the vessels shown are the most operationally relevant, not just random.

---

## 7. Firebase Write Strategy

```
Firebase Realtime DB → /vessels/{vesselId}/state    (live position, updated every message)
Firebase Realtime DB → /vessels/{vesselId}/trail    (ring buffer, last 200 points)

Firestore → /vesselProfiles/{vesselId}              (static data: name, type, dimensions, IMO)
Firestore → /vesselAlerts/{vesselId}/alerts[]       (threat exposure history)
```

Realtime DB is used for live position (high-frequency writes, low read latency).
Firestore is used for everything that needs querying (operator view filtering, alert history).

---

## 8. Backup Transport B — Internal WebSocket Server

Exposed at `ws://localhost:3001/vessels/stream`. Clients (CesiumJS fallback) subscribe:

```json
{ "subscribe": "ALL" }
// or
{ "subscribe": "MMSI", "ids": [123456789, 987654321] }
```

Server pushes `VesselState` patches (delta only) every 5 seconds per vessel.

## 9. Backup Transport C — REST Snapshot Endpoint

```
GET /vessels/snapshot?lod=200&type=CARGO,TANKER,AIRCRAFT_CARGO
```

Returns full array of current `VesselState[]` at the requested LOD. Cached for 10s to prevent hammering Firebase.

---

## 10. Error Handling & Retry Contract

| Error Scenario                          | Detection           | Response                                                                  |
| --------------------------------------- | ------------------- | ------------------------------------------------------------------------- |
| AISStream WebSocket disconnect          | `ws.on('close')`    | Exponential backoff: 1s → 2s → 4s → 8s → max 60s                          |
| AISStream message malformed JSON        | `JSON.parse` throws | Log `WARN`, increment `parse_error_count`, skip message                   |
| OpenSky 429 rate limit                  | HTTP 429 response   | Back off 60s, log `WARN` with retry timestamp                             |
| OpenSky OAuth token expired             | HTTP 401 response   | Immediately refresh token via token endpoint                              |
| Firebase write failure                  | Admin SDK throws    | Retry 3× with 500ms delay, then log `ERROR` and write to local queue file |
| Vessel SOG = 0 + NavigationalStatus = 0 | Derived logic       | Flag `dataQuality = "LOW"`, skip ETA calculation                          |
| Position lat/lon = 91.0/181.0           | Out-of-range check  | AIS "not available" sentinels — drop position update, keep profile        |
| `last_contact` age > 120s (OpenSky)     | Timestamp diff      | Set `isUnderway = false`, flag stale in `VesselState.dataQuality`         |

---

## 11. Logging Specification

**Log levels:** `TRACE` → `DEBUG` → `INFO` → `WARN` → `ERROR` → `FATAL`

**Local dev** (`NODE_ENV=development`): pino-pretty with colors
**Production** (`NODE_ENV=production`): JSON, one object per line → Google Cloud Logging

**Mandatory log events:**

```js
// Every AISStream message received
LOG.debug({
  event: "AIS_MESSAGE_RECEIVED",
  messageType: "PositionReport",
  mmsi: 123456789,
  lat: 1.264,
  lon: 103.825,
  sog: 12.4,
  cog: 187.3,
  navStatus: 0,
  receiptUtc: "2026-03-20T05:30:00.123Z",
  ingestLatencyMs: 34,
});

// Every Firebase write (sampled 1-in-10 in prod to reduce log volume)
LOG.debug({
  event: "FIREBASE_WRITE",
  path: "/vessels/MMSI:123456789/state",
  vesselId: "MMSI:123456789",
  writeLatencyMs: 12,
});

// Every ETA calculation
LOG.info({
  event: "ETA_CALCULATED",
  vesselId: "MMSI:123456789",
  destinationPort: "SGSIN",
  distanceNm: 1240.5,
  sogKnots: 12.4,
  etaHours: 100.0,
  calculatedEtaUtc: "2026-03-24T09:30:00Z",
  selfReportedEtaUtc: "2026-03-24T12:00:00Z",
  deltaHours: 2.5,
});

// Every anomaly trigger
LOG.warn({
  event: "VESSEL_ANOMALY",
  anomalyType: "SHARP_TURN" | "SUDDEN_STOP" | "EMERGENCY_SQUAWK" | "AIS_DARK",
  vesselId: "MMSI:123456789",
  details: { rateOfTurn: 127, previousCog: 180, newCog: 270 },
  timestamp: "2026-03-20T05:30:00Z",
});

// WebSocket reconnect
LOG.warn({
  event: "AISSTREAM_RECONNECT",
  attempt: 3,
  backoffMs: 4000,
  reason: "Connection closed unexpectedly",
});

// LOD change
LOG.info({
  event: "LOD_CHANGE",
  requestedCount: 500,
  actualCount: 487,
  filteredOut: 13,
  reason: "below_priority_threshold",
});
```

---

## 12. Environment Variables

```env
# AISStream
AISSTREAM_API_KEY=

# OpenSky
OPENSKY_CLIENT_ID=
OPENSKY_CLIENT_SECRET=
OPENSKY_TOKEN_ENDPOINT=https://opensky-network.org/api/security/token

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
FIREBASE_REALTIME_DB_URL=https://<project-id>.firebaseio.com
FIREBASE_PROJECT_ID=

# Internal Auth
INTERNAL_API_KEY=

# Config
NODE_ENV=development
PORT=3001
OPENSKY_POLL_INTERVAL_MS=30000
LOD_DEFAULT=200
LOD_MAX=5000
LOG_LEVEL=debug
```

---

## 13. Folder Structure

```
vdie/
├── src/
│   ├── connectors/
│   │   ├── aisstream.js        # WebSocket client, reconnect logic
│   │   └── opensky.js          # OAuth2 + polling loop
│   ├── normalizers/
│   │   ├── aisNormalizer.js    # Raw AIS → VesselState
│   │   └── adsbNormalizer.js   # Raw OpenSky → VesselState
│   ├── calculators/
│   │   ├── eta.js              # Haversine + SOG → ETA
│   │   ├── deadReckoning.js    # COG + SOG → projected positions
│   │   └── anomaly.js          # RoT, SOG drop, squawk triggers
│   ├── writers/
│   │   ├── firebaseWriter.js   # Realtime DB + Firestore writes
│   │   └── localQueue.js       # Fallback write queue on Firebase failure
│   ├── transport/
│   │   ├── wsServer.js         # Backup transport B
│   │   └── restSnapshot.js     # Backup transport C
│   ├── lod/
│   │   └── priorityScorer.js   # LOD slider vessel selection
│   ├── routes/
│   │   └── api.js              # /lod, /vessels/snapshot, /health
│   ├── logger.js               # pino setup, env-aware
│   └── index.js                # Fastify init, connector bootstrap
├── secrets/                    # gitignored
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

---
