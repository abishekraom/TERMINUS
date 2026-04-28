# TERMINUS

Transit and Event Routing Monitoring, Intelligence, and Navigation Unified System

TERMINUS is an integrated maritime and aviation situational awareness platform designed for real-time monitoring, threat intelligence analysis, and dynamic routing. It combines global vessel/aircraft telemetry with AI-driven threat classification to provide automated rerouting and risk assessment.

## System Architecture

The project is composed of four primary sub-systems:

### 1. Globe (Frontend)
The visualization layer, built with React and a custom design system titled "Gods Eye."
- Technical Stack: React, Vite, Tailwind CSS.
- Design Aesthetic: Industrial, high-precision IoT dashboard with glassmorphism and technical typography (Fira Code).
- Features: Real-time map visualization, telemetry overlays, and threat zone displays.

### 2. VDIE (Vessel Data Ingestion Engine)
The ingestion backbone for live telemetry.
- Technical Stack: Node.js, Fastify, Firebase Realtime Database.
- Protocols: WebSockets for live AIS and ADS-B data.
- Sources: Integrates AISStream for maritime data and OpenSky Network for aviation data.
- Features: Data normalization, anomaly detection (emergency squawks, position jumps), and trail persistence.

### 3. TIE (Threat Intelligence Engine)
The intelligence layer that identifies and classifies global risks.
- Technical Stack: Node.js, Gemini 2.0 Flash, Firecrawl.
- Logic: Scrapes news and NOTAMs, then uses LLMs to classify events by severity, threat type, and geographic impact.
- Geometry: Generates 32-vertex GeoJSON polygons for point-radius threats to ensure spatial precision in routing.
- Integration: Directly notifies the routing engine of new active threat zones.

### 4. PFE (Path Finding Engine)
The analytical core responsible for safe navigation.
- Technical Stack: Python, Shapely.
- Algorithms: Implements A* search for maritime routes and Great Circle interpolation for aviation.
- Logic: Dynamically weights graph edges based on threat severity (1-5 scale) and vessel draught.
- Features: Automated deflection around NOTAM blocks and ETA recalculation based on detours.

## Getting Started

### Prerequisites

Before setting up TERMINUS, ensure you have the following software installed:

- Node.js (v20 or higher)
- Python (v3.10 or higher)
- Git
- A Firebase Project (for Realtime Database and Firestore)
- Google Gemini API Key (for TIE threat classification)
- Firecrawl API Key (for TIE news scraping)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/TERMINUS.git
   cd TERMINUS
   ```

2. Setup the Path Finding Engine (PFE):
   ```bash
   cd pfe
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. Setup the Vessel Data Ingestion Engine (VDIE):
   ```bash
   cd ../vdie
   npm install
   # Create a .env file based on the Environment Variables section below
   ```

4. Setup the Threat Intelligence Engine (TIE):
   ```bash
   cd ../tie
   npm install
   cp .env.example .env
   ```

5. Setup the Globe (Frontend):
   ```bash
   cd ../globe/frontend
   npm install
   cp .env.example .env
   ```

## Environment Variables

Each sub-system requires specific environment variables to be defined in a `.env` file within its respective directory.

### TIE (Threat Intelligence Engine)
```env
PORT=3002
LOG_LEVEL=debug
NODE_ENV=development

# External Integrations
GEMINI_API_KEY=your_gemini_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key

# Optional Data Sources
NEWSAPI_KEY=your_newsapi_key
ACLED_API_KEY=your_acled_key
ACLED_EMAIL=your_acled_email
OWM_API_KEY=your_open_weather_map_key

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=admin@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### PFE (Path Finding Engine)
```env
PORT=3003
ENV=development
LOG_LEVEL=DEBUG

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_REALTIME_DB_URL=https://your-project-default-rtdb.firebaseio.com

# Collection Names
FIRESTORE_THREATS_COLLECTION=threats
FIRESTORE_VESSEL_ROUTES_COLLECTION=vesselRoutes
FIRESTORE_VESSEL_PROFILES_COLLECTION=vesselProfiles

# Pathfinding Logic
MARITIME_GRAPH_PATH=./data/maritime_graph.geojson
ASTAR_MAX_NODES=10000
SNAP_WARN_DISTANCE_NM=500
ETA_ROUTING_FACTOR=1.08
AIR_SAMPLE_INTERVAL_NM=200
```

### VDIE (Vessel Data Ingestion Engine)
```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=debug

# Live Feeds
AISSTREAM_API_KEY=your_aisstream_api_key
OPENSKY_CLIENT_ID=your_opensky_client_id
OPENSKY_CLIENT_SECRET=your_opensky_client_secret

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_REALTIME_DB_URL=https://your-project-default-rtdb.firebaseio.com

# Level of Detail
LOD_DEFAULT=200
LOD_MAX=5000
```

### Globe (Frontend)
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Running the System

To run the full system, start each component in a separate terminal:

1. **PFE**: `uvicorn src.main:app --reload` (from `/pfe`)
2. **VDIE**: `npm start` (from `/vdie`)
3. **TIE**: `npm start` (from `/tie`)
4. **Globe**: `npm run dev` (from `/globe/frontend`)

## Project Structure

- /globe: React frontend and technical design system.
- /vdie: Ingestion service for real-time AIS/ADS-B feeds.
- /tie: AI-powered threat analysis and news classification.
- /pfe: Routing optimization and detour calculation service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
