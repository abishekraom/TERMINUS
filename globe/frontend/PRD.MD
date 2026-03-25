# PRD-02: Threat Intelligence Engine (TIE)

**Document Version:** 1.0.0
**Engine Codename:** `tie`
**Last Updated:** 2026-03-20

---

## 1. Overview

The Threat Intelligence Engine is a continuously running Node.js microservice that ingests data from 8 distinct intelligence sources, runs Gemini 2.0 Flash classification on each event, produces a structured `ThreatZone` GeoJSON document, writes it to Firestore, and notifies the Route Monitor (in VDIE) via an internal webhook. It is the supply-chain-specific evolution of the worldmonitor open-source architecture, replacing its client-side classification with server-side Gemini and adding maritime-specific context.

---

## 2. Tech Stack

| Layer             | Technology                                            |
| ----------------- | ----------------------------------------------------- |
| Runtime           | Node.js 20 LTS                                        |
| Framework         | Fastify 4.x                                           |
| HTTP Client       | `undici`                                              |
| RSS Parsing       | `rss-parser`                                          |
| Web Scraping      | Firecrawl API (`@mendable/firecrawl-js`)              |
| Scheduling        | `node-cron`                                           |
| AI Classification | Google Gemini 2.0 Flash API (`@google/generative-ai`) |
| Firebase          | `firebase-admin` 12.x → Firestore                     |
| Logging           | `pino` + `pino-pretty`                                |
| Auth              | Shared `x-api-key` (per Q12)                          |

---

## 3. Intelligence Sources — Complete Configuration & Field Reference

### Source 1: GDELT Project (Primary News — Unlimited)

```
Endpoint: https://api.gdeltproject.org/api/v2/doc/doc
Query params:
  query=  <maritime supply chain keywords>
  mode=   ArtList
  maxrecords= 250
  format= json
  timespan= 15min   ← poll every 3 minutes, look back 15min (overlap prevents gaps)
```

**ALL fields returned per article:**

| Field           | Type   | Description             |
| --------------- | ------ | ----------------------- |
| `url`           | string | Article URL             |
| `url_mobile`    | string | Mobile version          |
| `title`         | string | Article headline        |
| `seendate`      | string | YYYYMMDDTHHMMSSZ format |
| `socialimage`   | string | OG image URL            |
| `domain`        | string | Publisher domain        |
| `language`      | string | ISO 639-1 language code |
| `sourcecountry` | string | Publisher country       |

**Fields TIE uses:** `url`, `title`, `seendate`, `domain`
**Action:** Feed `title` + fetched article body (via Firecrawl) to Gemini.

---

### Source 2: NewsAPI (Supplementary — 15-min interval, ≤96 req/day)

```
Endpoint: https://newsapi.org/v2/everything
Params:
  q=      "supply chain" OR "port congestion" OR "shipping disruption" OR "canal closure"
  language= en
  sortBy= publishedAt
  pageSize= 50
  apiKey= <key>
```

**ALL fields returned per article:**

| Field         | Type        | Description                                |
| ------------- | ----------- | ------------------------------------------ |
| `source.id`   | string/null | NewsAPI source identifier                  |
| `source.name` | string      | Publisher name                             |
| `author`      | string/null | Author name                                |
| `title`       | string      | Headline                                   |
| `description` | string      | Lede paragraph                             |
| `url`         | string      | Article URL                                |
| `urlToImage`  | string/null | Thumbnail image                            |
| `publishedAt` | string      | ISO-8601 timestamp                         |
| `content`     | string      | First 200 chars of body (truncated by API) |

**Fields TIE uses:** `title`, `description`, `url`, `publishedAt`, `source.name`

---

### Source 3: Reuters / BBC / AP — RSS Feeds

```
Reuters world news: https://feeds.reuters.com/reuters/worldNews
Reuters business:   https://feeds.reuters.com/reuters/businessNews
BBC world:          https://feeds.bbci.co.uk/news/world/rss.xml
AP top news:        https://rsshub.app/ap/topics/apf-topnews
Poll interval:      3 minutes
```

**ALL fields returned per RSS item (via `rss-parser`):**

| Field            | Type     | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `title`          | string   | Article headline                         |
| `link`           | string   | Article URL                              |
| `pubDate`        | string   | RFC-2822 publication date                |
| `content`        | string   | Full HTML content (if in feed)           |
| `contentSnippet` | string   | Plain text snippet                       |
| `guid`           | string   | Unique identifier for deduplication      |
| `categories`     | string[] | Topic tags                               |
| `isoDate`        | string   | ISO-8601 pub date (parsed by rss-parser) |
| `enclosure`      | object   | Media attachment (image/audio), ignore   |
| `dc:creator`     | string   | Author (Dublin Core extension)           |

**Fields TIE uses:** `title`, `contentSnippet`, `link`, `isoDate`, `guid` (dedup key)

---

### Source 4: ACLED — Armed Conflict Location & Event Data

```
Endpoint: https://api.acleddata.com/acled/read
Params:
  key=        <api_key>
  email=      <email>
  event_date= <today>
  event_date_where= BETWEEN
  region=     11,12,15     ← Middle East, North Africa, Southeast Asia (shipping-relevant)
  event_type= Battles|Violence against civilians|Strategic developments
  limit=      100
Poll interval: 10 minutes (events don't update more frequently)
```

**ALL fields returned per event:**

| Field                | Type   | Description                      |
| -------------------- | ------ | -------------------------------- |
| `data_id`            | string | ACLED event unique ID            |
| `iso`                | int    | ISO country code                 |
| `event_id_cnty`      | string | Country-specific event ID        |
| `event_id_no_cnty`   | string | Numeric event ID                 |
| `event_date`         | string | YYYY-MM-DD                       |
| `year`               | int    | Year                             |
| `time_precision`     | int    | 1=exact date, 2=week, 3=month    |
| `event_type`         | string | e.g. "Battles"                   |
| `sub_event_type`     | string | e.g. "Armed clash"               |
| `actor1`             | string | Primary actor                    |
| `assoc_actor_1`      | string | Associated actor 1               |
| `inter1`             | int    | Actor 1 type code                |
| `actor2`             | string | Secondary actor                  |
| `assoc_actor_2`      | string | Associated actor 2               |
| `inter2`             | int    | Actor 2 type code                |
| `interaction`        | int    | Interaction type code            |
| `civilian_targeting` | string | Civilian targeting flag          |
| `iso3`               | string | ISO 3-letter country code        |
| `country`            | string | Country name                     |
| `admin1`             | string | Level-1 administrative region    |
| `admin2`             | string | Level-2 administrative region    |
| `admin3`             | string | Level-3 administrative region    |
| `location`           | string | Location name                    |
| `latitude`           | float  | Event latitude                   |
| `longitude`          | float  | Event longitude                  |
| `geo_precision`      | int    | 1=exact, 2=nearby, 3=approximate |
| `source`             | string | Data source                      |
| `source_scale`       | string | Source reliability level         |
| `notes`              | string | Narrative description            |
| `fatalities`         | int    | Recorded fatalities              |
| `timestamp`          | int    | Unix epoch of last edit          |
| `tags`               | string | Comma-separated tags             |

**Fields TIE uses:** `data_id`, `event_type`, `sub_event_type`, `latitude`, `longitude`, `country`, `admin1`, `location`, `notes`, `fatalities`, `event_date`, `geo_precision`

---

### Source 5: OpenWeatherMap — Current Weather at Maritime Chokepoints

```
Endpoint: https://api.openweathermap.org/data/2.5/weather
Params: lat=<lat>&lon=<lon>&appid=<key>&units=metric
Poll interval: 45 seconds
Monitored locations (20 key chokepoints):
  Strait of Malacca, Suez Canal (N+S), Strait of Hormuz, Bab-el-Mandeb,
  Panama Canal (N+S), Cape of Good Hope, English Channel, Dover Strait,
  Lombok Strait, Sunda Strait, Bosphorus, Dardanelles, Gibraltar,
  Taiwan Strait, Luzon Strait, Torres Strait, Bass Strait, Skagerrak
```

**ALL fields returned:**

| Field                        | Type   | Description                          |
| ---------------------------- | ------ | ------------------------------------ |
| `coord.lon` / `coord.lat`    | float  | Queried coordinates                  |
| `weather[0].id`              | int    | Weather condition code               |
| `weather[0].main`            | string | e.g. "Thunderstorm", "Fog"           |
| `weather[0].description`     | string | e.g. "heavy intensity rain"          |
| `weather[0].icon`            | string | Icon code                            |
| `main.temp`                  | float  | Temperature °C                       |
| `main.feels_like`            | float  | Apparent temperature °C              |
| `main.temp_min`              | float  | Min temp                             |
| `main.temp_max`              | float  | Max temp                             |
| `main.pressure`              | int    | Atmospheric pressure hPa             |
| `main.humidity`              | int    | Relative humidity %                  |
| `main.sea_level`             | int    | Sea level pressure hPa               |
| `main.grnd_level`            | int    | Ground level pressure hPa            |
| `visibility`                 | int    | Visibility in metres                 |
| `wind.speed`                 | float  | Wind speed m/s                       |
| `wind.deg`                   | int    | Wind direction degrees               |
| `wind.gust`                  | float  | Wind gust speed m/s                  |
| `clouds.all`                 | int    | Cloud coverage %                     |
| `rain.1h`                    | float  | Rain volume last 1hr mm (if present) |
| `snow.1h`                    | float  | Snow volume last 1hr mm (if present) |
| `dt`                         | int    | Unix timestamp of data               |
| `sys.country`                | string | Country code                         |
| `sys.sunrise` / `sys.sunset` | int    | Unix timestamps                      |
| `timezone`                   | int    | UTC offset seconds                   |
| `id`                         | int    | OWM city ID                          |
| `name`                       | string | Location name                        |
| `cod`                        | int    | HTTP status code                     |

**Fields TIE uses:** `coord`, `weather[0].id`, `weather[0].main`, `weather[0].description`, `main.pressure`, `visibility`, `wind.speed`, `wind.gust`, `rain.1h`, `snow.1h`, `dt`

**Threat trigger thresholds:**

```
wind.speed > 17.2 m/s (Beaufort 8, gale)       → severity 3
wind.speed > 24.5 m/s (Beaufort 10, storm)      → severity 4
wind.gust  > 32.7 m/s (Beaufort 12, hurricane)  → severity 5
visibility < 1000m                              → severity 3 (fog)
weather.id IN [200-232] (thunderstorm)          → severity 3
weather.id IN [900-902] (extreme)               → severity 5
main.pressure < 960 hPa                         → severity 4 (cyclone indicator)
```

---

### Source 6: USGS — Earthquake Feed

```
Endpoint: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson
Poll interval: 3 minutes (feed updates ~1 min after event)
No auth required, no rate limits.
```

**ALL fields returned per feature:**

| Field                     | Type        | Description                        |
| ------------------------- | ----------- | ---------------------------------- |
| `id`                      | string      | Unique event ID                    |
| `geometry.coordinates[0]` | float       | Longitude                          |
| `geometry.coordinates[1]` | float       | Latitude                           |
| `geometry.coordinates[2]` | float       | Depth in km                        |
| `properties.mag`          | float       | Magnitude                          |
| `properties.place`        | string      | Human-readable location            |
| `properties.time`         | int         | Origin time Unix ms                |
| `properties.updated`      | int         | Last update Unix ms                |
| `properties.tz`           | int/null    | Timezone offset                    |
| `properties.url`          | string      | USGS event URL                     |
| `properties.detail`       | string      | Detail feed URL                    |
| `properties.felt`         | int/null    | Reports of feeling                 |
| `properties.cdi`          | float/null  | Max reported intensity             |
| `properties.mmi`          | float/null  | Max instrumental intensity         |
| `properties.alert`        | string/null | "green"\|"yellow"\|"orange"\|"red" |
| `properties.status`       | string      | "automatic"\|"reviewed"            |
| `properties.tsunami`      | int         | 1 = tsunami potential              |
| `properties.sig`          | int         | Significance score 0–1000          |
| `properties.net`          | string      | Contributor network code           |
| `properties.code`         | string      | Event code                         |
| `properties.ids`          | string      | Associated event IDs               |
| `properties.sources`      | string      | Contributing networks              |
| `properties.types`        | string      | Product types available            |
| `properties.nst`          | int/null    | Number of seismic stations         |
| `properties.dmin`         | float/null  | Distance to nearest station        |
| `properties.rms`          | float       | RMS travel time residual           |
| `properties.gap`          | float/null  | Largest azimuthal gap              |
| `properties.magType`      | string      | Magnitude type (e.g. "mww")        |
| `properties.type`         | string      | "earthquake"\|"quarry blast"       |
| `properties.title`        | string      | Full display title                 |

**Fields TIE uses:** `id`, `geometry.coordinates[0,1,2]`, `properties.mag`, `properties.place`, `properties.time`, `properties.tsunami`, `properties.alert`, `properties.sig`

**Threat trigger:** `mag >= 6.0` OR `tsunami == 1` → pass to Gemini for maritime impact assessment.

---

### Source 7: FAA NOTAM API — Airspace Notices

```
Endpoint: https://external-api.faa.gov/notamapi/v1/notams
Params:
  icaoLocation=   <airport ICAO code, cycle through top 50 cargo airports>
  notamType=      NOTAM
  effectiveStartDate= <now>
Poll interval: 10 minutes per airport batch (5 airports per call)
Auth: FAA API key (free registration)
```

**ALL fields returned per NOTAM:**

| Field                                           | Type   | Description                               |
| ----------------------------------------------- | ------ | ----------------------------------------- |
| `properties.coreNOTAMData.notam.id`             | string | Unique NOTAM identifier                   |
| `properties.coreNOTAMData.notam.number`         | string | Official NOTAM number                     |
| `properties.coreNOTAMData.notam.type`           | string | "N"\|"R"\|"C" (New/Replace/Cancel)        |
| `properties.coreNOTAMData.notam.issued`         | string | ISO-8601 issue datetime                   |
| `properties.coreNOTAMData.notam.affectedFIR`    | string | Flight Information Region                 |
| `properties.coreNOTAMData.notam.selectionCode`  | string | NOTAM subject code                        |
| `properties.coreNOTAMData.notam.traffic`        | string | Traffic type (IFR/VFR/MVFR)               |
| `properties.coreNOTAMData.notam.purpose`        | string | Purpose codes                             |
| `properties.coreNOTAMData.notam.scope`          | string | A=aerodrome, E=en-route, W=warning        |
| `properties.coreNOTAMData.notam.minimumFL`      | string | Minimum flight level                      |
| `properties.coreNOTAMData.notam.maximumFL`      | string | Maximum flight level                      |
| `properties.coreNOTAMData.notam.coordinates`    | string | Center point "DD MM SS N/S DDD MM SS E/W" |
| `properties.coreNOTAMData.notam.radius`         | string | Radius in nautical miles                  |
| `properties.coreNOTAMData.notam.effectiveStart` | string | ISO-8601 effective start                  |
| `properties.coreNOTAMData.notam.effectiveEnd`   | string | ISO-8601 effective end                    |
| `properties.coreNOTAMData.notam.text`           | string | Raw NOTAM text (Q-line format)            |
| `properties.coreNOTAMData.notam.classification` | string | "INTL"\|"DOM"\|"MIL"\|"FDC"               |
| `properties.coreNOTAMData.notam.accountId`      | string | Issuing authority                         |
| `properties.coreNOTAMData.notam.icaoLocation`   | string | ICAO airport code                         |

**Fields TIE uses:** `notam.id`, `notam.number`, `notam.text`, `notam.coordinates`, `notam.radius`, `notam.effectiveStart`, `notam.effectiveEnd`, `notam.scope`, `notam.icaoLocation`

---

### Source 8: Firecrawl — Custom Web Scraping

```js
// Used for:
// 1. Fetching full article body from GDELT/NewsAPI URLs
// 2. Scraping MarineTraffic port congestion pages (public)
// 3. Port authority notices (e.g., Port of Singapore MPA notices)

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const result = await firecrawl.scrapeUrl(url, {
  formats: ["markdown"],
  onlyMainContent: true,
  timeout: 10000,
});
```

**ALL fields returned:**

| Field                         | Type        | Description                    |
| ----------------------------- | ----------- | ------------------------------ |
| `success`                     | bool        | Whether scrape succeeded       |
| `data.markdown`               | string      | Main content as Markdown       |
| `data.html`                   | string      | Raw HTML (not requested, omit) |
| `data.metadata.title`         | string      | Page title                     |
| `data.metadata.description`   | string      | Meta description               |
| `data.metadata.language`      | string      | Detected language              |
| `data.metadata.keywords`      | string      | Meta keywords                  |
| `data.metadata.robots`        | string      | Robots directive               |
| `data.metadata.ogTitle`       | string      | Open Graph title               |
| `data.metadata.ogDescription` | string      | Open Graph description         |
| `data.metadata.publishedTime` | string      | Article publish date           |
| `data.metadata.modifiedTime`  | string      | Last modified date             |
| `data.metadata.sourceURL`     | string      | Canonical URL                  |
| `data.metadata.statusCode`    | int         | HTTP status                    |
| `data.metadata.error`         | string/null | Error description              |

**Fields TIE uses:** `data.markdown` (fed to Gemini), `data.metadata.title`, `data.metadata.publishedTime`, `data.metadata.sourceURL`

---

## 4. Gemini Classification — Prompt Engineering

Every ingestible event (news article, weather alert, USGS event, NOTAM, conflict event) is sent to Gemini 2.0 Flash via the Google Generative AI SDK with a **strictly typed system prompt**:

```js
const systemPrompt = `
You are a maritime and air freight supply chain risk analyst.
Analyze the provided intelligence item and return ONLY valid JSON matching this exact schema.
Never return markdown, never add explanatory text outside JSON.

SCHEMA:
{
  "isRelevant": boolean,          // false = ignore completely (e.g. celebrity news)
  "threatType": one of [
    "WEATHER", "PORT_CONGESTION", "GEOPOLITICAL_CONFLICT",
    "AIRSPACE_CLOSURE", "SEISMIC", "SANCTIONS", "INFRASTRUCTURE",
    "PIRACY", "LABOR_STRIKE", "CYBER", "PANDEMIC", "UNKNOWN"
  ],
  "subType": string,              // e.g. "TYPHOON", "DOCK_WORKER_STRIKE", "CANAL_BLOCKAGE"
  "confidence": float 0.0-1.0,
  "severity": integer 1-5,        // 1=minor, 5=catastrophic
  "affectedModes": array of ["maritime", "air", "both"],
  "geoBoundary": {
    "type": "POINT_RADIUS" | "BOUNDING_BOX" | "NAMED_REGION",
    "centerLat": float or null,
    "centerLon": float or null,
    "radiusKm": float or null,
    "bbox": [[minLon,minLat],[maxLon,maxLat]] or null,
    "namedRegion": string or null  // e.g. "Red Sea", "Suez Canal"
  },
  "affectedInfrastructure": {
    "ports": [{"name": string, "unlocode": string}],
    "airports": [{"name": string, "icao": string}],
    "waterways": [string],         // e.g. ["Suez Canal", "Strait of Hormuz"]
    "countries": [string]          // ISO 3166-1 alpha-2
  },
  "temporal": {
    "estimatedStartUtc": string or null,   // ISO-8601
    "estimatedEndUtc": string or null,
    "estimatedDurationHours": number or null,
    "isOngoing": boolean
  },
  "routingImpact": {
    "edgeCostMultiplier": float,   // 1.0=no penalty, 5.0=impassable
    "isHardBlock": boolean,        // never route through this zone
    "minimumSafeDistanceKm": float,
    "suggestedDetourRegion": string or null
  },
  "operatorActions": [string],     // list of recommended actions for operators
  "summary": string,               // 2-3 sentence human-readable summary
  "rawConfidenceReasoning": string // Gemini's brief self-explanation for its confidence score
}
`;

const userPrompt = `
SOURCE_TYPE: ${sourceType}
TITLE: ${title}
CONTENT: ${content.slice(0, 4000)}
ADDITIONAL_CONTEXT: ${JSON.stringify(additionalContext)}
`;
```

---

## 5. The `ThreatZone` Output Contract (Integration with VDIE & Pathfinder)

This is the canonical document written to Firestore `/threats/{threatId}` and sent to VDIE's Route Monitor:

```ts
interface ThreatZone {
  // ── Identity ──────────────────────────────────────────────
  threatId: string; // uuidv4()
  schemaVersion: "1.1.0";
  status: "ACTIVE" | "EXPIRED" | "SUPERSEDED" | "MANUALLY_DISMISSED";

  // ── Source Provenance ─────────────────────────────────────
  source: {
    provider:
      | "GDELT"
      | "NEWSAPI"
      | "RSS"
      | "ACLED"
      | "OWM"
      | "NOAA"
      | "USGS"
      | "FAA_NOTAM"
      | "FIRECRAWL";
    originalUrl: string;
    headline: string;
    rawText: string; // first 2000 chars, for audit
    fetchedAtUtc: string; // ISO-8601
    rawApiResponse: object; // full source response, for debugging
  };

  // ── AI Classification ─────────────────────────────────────
  classification: {
    threatType: ThreatType;
    subType: string;
    confidence: number; // 0.0–1.0
    severity: 1 | 2 | 3 | 4 | 5;
    affectedModes: Array<"maritime" | "air">;
    geminiModel: "gemini-2.0-flash";
    geminiRawOutput: string; // full Gemini response JSON string
    classifiedAtUtc: string;
    classificationLatencyMs: number;
    isRelevant: boolean;
    rawConfidenceReasoning: string;
  };

  // ── Geospatial (GeoJSON Feature — plugs directly into CesiumJS) ───
  geometry: {
    type: "Feature";
    geometry: {
      type: "Polygon"; // always normalized to Polygon
      coordinates: number[][][]; // exterior ring
    };
    properties: {
      centerLat: number;
      centerLon: number;
      radiusKm: number;
      namedRegion?: string;
    };
  };

  // ── Affected Infrastructure ───────────────────────────────
  affectedInfrastructure: {
    ports: Array<{ name: string; unlocode: string; lat: number; lon: number }>;
    airports: Array<{ name: string; icao: string; lat: number; lon: number }>;
    waterways: string[];
    countries: string[]; // ISO 3166-1 alpha-2
  };

  // ── Temporal Window ───────────────────────────────────────
  temporal: {
    estimatedStartUtc: string;
    estimatedEndUtc: string | null;
    estimatedDurationHours: number | null;
    isOngoing: boolean;
    createdAtUtc: string;
    lastUpdatedUtc: string;
    expiresAtUtc: string; // auto-expire = createdAt + max(estimatedDuration, 24h)
  };

  // ── Routing Integration ───────────────────────────────────
  routingImpact: {
    edgeCostMultiplier: number; // directly fed as A* edge weight
    isHardBlock: boolean;
    minimumSafeDistanceKm: number;
    suggestedDetourRegion: string | null;
    affectedEdgeIds: string[]; // populated by Pathfinder after graph update
  };

  // ── Impact Assessment (populated by Route Monitor in VDIE) ──
  impactAssessment: {
    affectedVesselCount: number;
    affectedVesselIds: string[]; // MMSI:xxx / ICAO:xxx
    affectedOperatorIds: string[];
    estimatedTotalDelayHours: number;
    economicImpactCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };

  // ── Human Outputs ─────────────────────────────────────────
  summary: string; // 2–3 sentence Gemini-generated summary
  operatorActions: string[]; // recommended operator steps

  // ── Future Extension Fields (reserved, null now) ──────────
  correlatedThreatIds: string[]; // for compound threat scoring (Phase 2)
  historicalSimilarEvents: string[]; // for ML-based duration prediction (Phase 2)
  confidenceDecayRate: number; // how fast confidence drops over time (Phase 2)
}
```

This schema is designed so that:

- The `geometry.geometry` field is a valid GeoJSON `Polygon` pluggable directly into CesiumJS `GeoJsonDataSource`
- The `routingImpact.edgeCostMultiplier` is consumed raw by the A\* engine — no translation needed
- `correlatedThreatIds` and `historicalSimilarEvents` are reserved null fields now but allow Phase 2 compound risk scoring without a schema migration

---

## 6. Polling Schedule & Deduplication

```
Source          | Interval  | Dedup Key                  | TTL Cache
────────────────|───────────|────────────────────────────|──────────
GDELT           | 3 min     | url hash                   | 24h
NewsAPI         | 15 min    | url hash                   | 24h
RSS (Reuters+)  | 3 min     | guid                       | 24h
ACLED           | 10 min    | data_id                    | 7 days
OWM (20 points) | 45 sec    | chokepoint_id + dt         | 60s
USGS            | 3 min     | USGS event id              | 48h
FAA NOTAM       | 10 min    | notam.number               | until effectiveEnd
Firecrawl       | On-demand | url hash                   | 1h
```

All dedup keys are stored as a **Firestore Set** under `/threatDedup/{sourceProvider}/{key}` with a TTL expiry. Before sending any event to Gemini, the engine checks this Set. If the key exists → skip. This prevents re-classifying the same Reuters article 6 times across a 30-minute window.

---

## 7. Firestore Write + VDIE Notification Flow

```
1. Event fetched → dedup check passes
2. Article body fetched via Firecrawl (if URL-based source)
3. Gemini classifies → ThreatZone object assembled
4. IF classification.isRelevant == false
       → LOG.debug("IRRELEVANT_EVENT_DROPPED", { title, source })
       → STOP, do not write anything
5. IF classification.confidence < 0.4
       → LOG.warn("LOW_CONFIDENCE_THREAT", { threatId, confidence, title })
       → Write to Firestore /threatsDraft/{threatId}  ← human review queue
       → STOP, do not notify VDIE
6. IF classification.confidence >= 0.4 AND classification.severity >= 1:
       a. Write full ThreatZone to Firestore /threats/{threatId}
       b. Write threatId to /threatsByRegion/{namedRegion}/{threatId}  ← spatial index
       c. Write threatId to /threatsByType/{threatType}/{threatId}     ← type index
       d. POST to VDIE internal webhook:
            URL:     http://vdie-service:3001/internal/threat-update
            Method:  POST
            Headers: { "x-api-key": INTERNAL_API_KEY, "Content-Type": "application/json" }
            Body: {
              "threatId": "uuid",
              "eventType": "THREAT_CREATED" | "THREAT_UPDATED" | "THREAT_EXPIRED",
              "geometry": <ThreatZone.geometry>,
              "routingImpact": <ThreatZone.routingImpact>,
              "severity": 4,
              "affectedModes": ["maritime"],
              "expiresAtUtc": "2026-03-21T11:27:00Z"
            }
       e. LOG.info("THREAT_WRITTEN_AND_NOTIFIED", { threatId, severity, type, lat, lon })
7. IF a ThreatZone already exists for same region + type within last 2h
       → UPDATE existing document (do not create duplicate)
       → Set status to "SUPERSEDED" on old doc
       → POST eventType: "THREAT_UPDATED" to VDIE
8. Scheduled expiry runner (cron: every 5 min):
       → Query /threats where status=="ACTIVE" AND expiresAtUtc < now()
       → Set status = "EXPIRED"
       → POST eventType: "THREAT_EXPIRED" to VDIE
       → VDIE Route Monitor removes threat zone edges from A* graph
```

---

## 8. Logging Specification (TIE)

Same pino setup as VDIE — JSON in prod, pretty-colored in dev.

**Mandatory log events:**

```js
// Poll cycle start
LOG.debug({
  event: "POLL_CYCLE_START",
  source: "GDELT",
  scheduledIntervalMs: 180000,
  queryKeywords: ["supply chain", "port congestion"],
});

// Raw fetch result
LOG.debug({
  event: "SOURCE_FETCH_COMPLETE",
  source: "GDELT",
  itemsFetched: 47,
  newAfterDedup: 12,
  duplicatesSkipped: 35,
  fetchLatencyMs: 340,
});

// Firecrawl scrape
LOG.debug({
  event: "FIRECRAWL_SCRAPE",
  url: "https://reuters.com/...",
  success: true,
  contentLengthChars: 3240,
  scrapeLatencyMs: 1200,
});

// Gemini classification
LOG.info({
  event: "GEMINI_CLASSIFICATION",
  threatId: "uuid",
  source: "GDELT",
  inputTitle: "Port of Shanghai congestion...",
  outputThreatType: "PORT_CONGESTION",
  outputSeverity: 4,
  outputConfidence: 0.87,
  isRelevant: true,
  classificationLatencyMs: 820,
  geminiModel: "gemini-2.0-flash",
  tokensUsed: { input: 610, output: 312 },
});

// Irrelevant event dropped
LOG.debug({
  event: "IRRELEVANT_EVENT_DROPPED",
  source: "NEWSAPI",
  title: "Taylor Swift announces world tour",
  confidence: 0.99,
  reason: "isRelevant=false from Gemini",
});

// Low confidence draft
LOG.warn({
  event: "LOW_CONFIDENCE_THREAT_DRAFTED",
  threatId: "uuid",
  confidence: 0.31,
  threatType: "GEOPOLITICAL_CONFLICT",
  title: "...",
  writtenTo: "/threatsDraft",
});

// Firestore write
LOG.info({
  event: "THREAT_FIRESTORE_WRITE",
  threatId: "uuid",
  collection: "/threats",
  threatType: "WEATHER",
  severity: 4,
  centerLat: 12.783,
  centerLon: 43.547,
  namedRegion: "Bab-el-Mandeb",
  writeLatencyMs: 45,
});

// VDIE webhook delivery
LOG.info({
  event: "VDIE_WEBHOOK_DELIVERED",
  threatId: "uuid",
  eventType: "THREAT_CREATED",
  httpStatus: 200,
  deliveryLatencyMs: 23,
});

// VDIE webhook failure
LOG.error({
  event: "VDIE_WEBHOOK_FAILED",
  threatId: "uuid",
  httpStatus: 503,
  attempt: 2,
  willRetryIn: 5000,
});

// Weather threshold breach
LOG.warn({
  event: "WEATHER_THRESHOLD_BREACH",
  chokepoint: "Strait of Hormuz",
  lat: 26.565,
  lon: 56.505,
  parameter: "wind.speed",
  value: 25.3,
  threshold: 24.5,
  severityTriggered: 4,
});

// USGS earthquake
LOG.warn({
  event: "SEISMIC_EVENT_DETECTED",
  usgsId: "us7000pqrs",
  magnitude: 6.8,
  depth: 12.4,
  tsunamiFlag: 1,
  place: "95km SSW of Padang, Indonesia",
  lat: -1.23,
  lon: 99.12,
});

// Threat expiry
LOG.info({
  event: "THREAT_EXPIRED",
  threatId: "uuid",
  originalSeverity: 3,
  activeDurationHours: 18.5,
  affectedVesselCount: 23,
});

// Dedup cache hit
LOG.trace({
  event: "DEDUP_CACHE_HIT",
  source: "RSS",
  guid: "reuters-abc123",
  skipped: true,
});

// Gemini API error
LOG.error({
  event: "GEMINI_API_ERROR",
  errorCode: 429,
  errorMessage: "Resource exhausted",
  retryAfterMs: 30000,
  inputTitle: "...",
});
```

---

## 9. Error Handling & Retry Contract (TIE)

| Error Scenario                     | Detection                    | Response                                                                                                                                                |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GDELT / NewsAPI HTTP 4xx           | Response status check        | Log `ERROR`, skip cycle, do not retry same poll (wait for next cron)                                                                                    |
| GDELT / NewsAPI HTTP 5xx           | Response status check        | Exponential backoff: 5s → 10s → 20s → skip                                                                                                              |
| Firecrawl scrape timeout           | Promise timeout at 10s       | Use article `title + description` as fallback Gemini input, flag `scrapeSuccess: false`                                                                 |
| Firecrawl scrape 403/blocked       | HTTP 403 or `success: false` | Log `WARN`, skip full-body fetch, use headline only                                                                                                     |
| Gemini API 429 (rate limit)        | HTTP 429                     | Pause classification queue for 30s, process buffer FIFO when resumed                                                                                    |
| Gemini returns invalid JSON        | `JSON.parse` throws          | Retry prompt once with stricter instruction; if fails again, write to `/threatsUnparseable` for manual review                                           |
| Gemini `isRelevant=false`          | Classification result check  | Drop silently with `TRACE` log — not an error                                                                                                           |
| ACLED API authentication failure   | HTTP 403                     | Log `ERROR`, disable ACLED source for 1h, alert via LOG.fatal                                                                                           |
| OWM API key exhausted              | HTTP 401                     | Log `FATAL`, TIE continues with remaining sources, flag weather layer as degraded                                                                       |
| VDIE webhook delivery failure      | HTTP non-2xx                 | Retry 3× at 5s intervals; if all fail, write `{threatId, webhookPayload}` to Firestore `/webhookRetryQueue` — a separate cron picks this up every 2 min |
| Firestore write failure            | Admin SDK throws             | Retry 3× with 500ms delay → write to local append-only file `threats-fallback.ndjson`                                                                   |
| OWM returns stale `dt` (>120s old) | Timestamp diff               | Skip threat evaluation for this cycle, log `WARN("OWM_STALE_DATA")`                                                                                     |
| USGS feed empty                    | Empty `features[]`           | Normal — log `DEBUG("USGS_NO_EVENTS")`, not an error                                                                                                    |
| FAA NOTAM coordinates null         | Field null check             | Attempt geocoding from `icaoLocation` code → fallback to airport lat/lon lookup table                                                                   |

---

## 10. Folder Structure (TIE)

```
tie/
├── src/
│   ├── sources/
│   │   ├── gdelt.js            # GDELT polling + dedup
│   │   ├── newsapi.js          # NewsAPI polling + dedup
│   │   ├── rss.js              # Reuters/BBC/AP RSS parsing
│   │   ├── acled.js            # ACLED conflict event ingestion
│   │   ├── openweathermap.js   # Chokepoint weather polling
│   │   ├── usgs.js             # Earthquake feed
│   │   ├── notam.js            # FAA NOTAM polling
│   │   └── firecrawl.js        # Article body scraper
│   ├── classifier/
│   │   ├── gemini.js           # Gemini API wrapper + prompt builder
│   │   ├── promptTemplates.js  # System + user prompt strings
│   │   └── responseValidator.js# JSON schema validation of Gemini output
│   ├── builders/
│   │   └── threatZoneBuilder.js# Raw source + Gemini output → ThreatZone object
│   ├── writers/
│   │   ├── firestoreWriter.js  # /threats, /threatsDraft, spatial indexes
│   │   ├── fallbackWriter.js   # Local NDJSON fallback on Firebase failure
│   │   └── webhookNotifier.js  # VDIE webhook delivery + retry queue
│   ├── dedup/
│   │   └── dedupCache.js       # Firestore-backed dedup Set with TTL
│   ├── scheduler/
│   │   ├── pollScheduler.js    # node-cron schedule definitions
│   │   └── expiryRunner.js     # Cron to expire old ThreatZones
│   ├── routes/
│   │   └── api.js              # /health, /threats/active, /threats/{id}
│   ├── constants/
│   │   ├── chokepoints.js      # 20 maritime chokepoint lat/lon definitions
│   │   ├── portLookup.js       # Top 50 cargo ports: name → UNLOCODE → lat/lon
│   │   ├── airportLookup.js    # Top 50 cargo airports: ICAO → lat/lon
│   │   └── weatherThresholds.js# Beaufort scale trigger values
│   ├── logger.js
│   └── index.js
├── secrets/
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 11. Environment Variables (TIE)

```env
# News Sources
GDELT_BASE_URL=https://api.gdeltproject.org/api/v2/doc/doc
NEWSAPI_KEY=
RSS_FEEDS=https://feeds.reuters.com/reuters/worldNews,https://feeds.reuters.com/reuters/businessNews,https://feeds.bbci.co.uk/news/world/rss.xml

# ACLED
ACLED_API_KEY=
ACLED_EMAIL=

# Weather
OWM_API_KEY=

# Seismic
USGS_FEED_URL=https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson

# Aviation
FAA_NOTAM_API_KEY=

# Scraping
FIRECRAWL_API_KEY=

# Google AI
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash

# Firebase
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
FIREBASE_PROJECT_ID=
FIRESTORE_THREATS_COLLECTION=threats
FIRESTORE_THREATS_DRAFT_COLLECTION=threatsDraft

# Internal Auth
INTERNAL_API_KEY=
VDIE_WEBHOOK_URL=http://vdie-service:3001/internal/threat-update

# Config
NODE_ENV=development
PORT=3002
LOG_LEVEL=debug

# Classification Thresholds
MIN_CONFIDENCE_TO_PUBLISH=0.4
MIN_MAGNITUDE_EARTHQUAKE=6.0
WEATHER_WIND_GALE_MS=17.2
WEATHER_WIND_STORM_MS=24.5
WEATHER_WIND_HURRICANE_MS=32.7
WEATHER_VISIBILITY_FOG_M=1000
WEATHER_PRESSURE_CYCLONE_HPA=960

# Poll Intervals (ms)
GDELT_POLL_INTERVAL_MS=180000
NEWSAPI_POLL_INTERVAL_MS=900000
RSS_POLL_INTERVAL_MS=180000
ACLED_POLL_INTERVAL_MS=600000
OWM_POLL_INTERVAL_MS=45000
USGS_POLL_INTERVAL_MS=180000
NOTAM_POLL_INTERVAL_MS=600000
```

---

## 12. Shared `docker-compose.yml` — Both Engines Together

This is the single file that boots the entire backend for local dev:

```yaml
version: "3.9"

networks:
  transit-net:
    driver: bridge

services:
  vdie:
    build:
      context: ./vdie
      dockerfile: Dockerfile
    container_name: vdie-service
    ports:
      - "3001:3001"
    env_file:
      - ./vdie/.env
    volumes:
      - ./vdie/secrets:/app/secrets:ro
      - vdie-fallback:/app/data
    networks:
      - transit-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    restart: unless-stopped
    depends_on:
      - tie

  tie:
    build:
      context: ./tie
      dockerfile: Dockerfile
    container_name: tie-service
    ports:
      - "3002:3002"
    env_file:
      - ./tie/.env
    volumes:
      - ./tie/secrets:/app/secrets:ro
      - tie-fallback:/app/data
    networks:
      - transit-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    restart: unless-stopped

volumes:
  vdie-fallback:
  tie-fallback:
```

---

## 13. Integration Contract Summary — How Both Engines Plug Into Everything Else

This is the single reference table your entire team should use so that the frontend, pathfinder, and operator alert system can be built independently without stepping on each other:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     INTEGRATION BOUNDARY TABLE                              │
├──────────────┬────────────────────┬───────────────────────────────────────┐
│ Consumer     │ What It Reads      │ How It Gets It                        │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ CesiumJS     │ Live vessel        │ Firebase Realtime DB                  │
│ Globe        │ positions + trails │ onValue("/vessels/{id}/state")        │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ CesiumJS     │ Active threat      │ Firestore onSnapshot                  │
│ Globe        │ zones (GeoJSON)    │ query("/threats", status=="ACTIVE")   │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ Pathfinding  │ Threat edge weight │ REST GET http://tie:3002/threats/     │
│ Engine       │ multipliers        │ active?mode=maritime                  │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ Pathfinding  │ Current vessel     │ REST GET http://vdie:3001/vessels/    │
│ Engine       │ position + SOG     │ snapshot?id={vesselId}                │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ Operator     │ Vessel alerts      │ Firestore onSnapshot                  │
│ Flutter UI   │ for their ships    │ query("/vesselAlerts/{vesselId}")      │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ Operator     │ Draft threats for  │ Firestore Admin SDK read              │
│ Admin Panel  │ human review       │ "/threatsDraft"                       │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ VDIE Route   │ New/updated/       │ Webhook POST from TIE →               │
│ Monitor      │ expired threats    │ http://vdie:3001/internal/            │
│              │                    │ threat-update                         │
├──────────────┼────────────────────┼───────────────────────────────────────┤
│ Demo replay  │ Pre-recorded       │ Local NDJSON files in                 │
│ system       │ vessel positions   │ vdie-fallback volume                  │
└──────────────┴────────────────────┴───────────────────────────────────────┘
```

**Three things your team must agree on before writing a single line of frontend code:**

1. **`vesselId` format is canonical**: always `"MMSI:123456789"` or `"ICAO:abc123"` — never a raw number. Every service, every Firestore document, every CesiumJS entity ID uses this string format. Mismatching this will break every join across the system.

2. **`ThreatZone.geometry` is always a `Polygon`**, never a `Point` or `Circle` — TIE's `threatZoneBuilder.js` converts all point+radius threats into a 32-vertex approximated circle polygon before writing to Firestore. CesiumJS, the pathfinder, and Turf.js all receive only `Polygon` objects.

3. **`ThreatZone.routingImpact.edgeCostMultiplier` is the single handshake value** between TIE and the pathfinder. The pathfinder must never fetch severity and compute its own multiplier — it reads this field directly. TIE owns the severity → multiplier translation, which follows this table:

```
Severity 1  →  edgeCostMultiplier: 1.2   (5-10% vessels reroute)
Severity 2  →  edgeCostMultiplier: 1.8   (most vessels take minor detour)
Severity 3  →  edgeCostMultiplier: 2.5   (significant detour mandatory)
Severity 4  →  edgeCostMultiplier: 4.0   (zone effectively avoided)
Severity 5  →  edgeCostMultiplier: 99.0  (isHardBlock=true, never route through)
```
