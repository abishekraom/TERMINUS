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
   # Update .env with your Firebase credentials
   ```

3. Setup the Vessel Data Ingestion Engine (VDIE):
   ```bash
   cd ../vdie
   npm install
   cp .env.example .env
   # Update .env with Firebase and Port configurations
   ```

4. Setup the Threat Intelligence Engine (TIE):
   ```bash
   cd ../tie
   npm install
   cp .env.example .env
   # Update .env with Gemini and Firecrawl API keys
   ```

5. Setup the Globe (Frontend):
   ```bash
   cd ../globe/frontend
   npm install
   # Create a .env file with your Firebase web configuration
   ```

### Configuration Details

#### Firebase Setup
- Enable Realtime Database for live telemetry (used by VDIE and Globe).
- Enable Firestore for threat zones and persistent profiles (used by TIE and PFE).
- Download your service account JSON file and place it in the `secrets/` directory of the respective microservices (`vdie`, `tie`, `pfe`).

#### API Keys
- Gemini API: Obtain from Google AI Studio.
- Firecrawl API: Obtain from firecrawl.dev.
- AISStream API: Required for maritime ingestion in VDIE.

### Running the System

To run the full system, you will need to start each component in a separate terminal:

1. **PFE**: `uvicorn src.main:app --reload`
2. **VDIE**: `npm start`
3. **TIE**: `npm start`
4. **Globe**: `npm run dev`

## Project Structure

- /globe: React frontend and technical design system.
- /vdie: Ingestion service for real-time AIS/ADS-B feeds.
- /tie: AI-powered threat analysis and news classification.
- /pfe: Routing optimization and detour calculation service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
