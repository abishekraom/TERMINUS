# Integration Plan: PFE & TIE into COMMAND AUTHORITY

## Goal
Integrate the fully implemented Threat Intelligence Engine (`tie`) and the core-complete Path Finding Engine (`pfe`) into the `COMMAND AUTHORITY` frontend panel (`globe/frontend/src/components/ControlsPanel.jsx`).

## Scope
- **IN SCOPE**: 
  - Exposing REST API endpoints on `tie` (`/threats/sync`) to trigger manual polling.
  - Exposing REST API endpoints on `pfe` (`/optimize`, `/simulate`) to trigger route recalculation.
  - Fixing the disconnected `pipeline.py` listener in `pfe`.
  - Adapting `pfe` to build a dynamic navigation graph using active vessels from the database and current threats (GeoJSON with `edgeCostMultiplier`) instead of a static JSON grid.
  - Wiring the `ControlsPanel.jsx` action buttons to these new endpoints.
- **OUT OF SCOPE**: 
  - Modifying the core A* (`astar.py`) or great-circle (`air_router.py`) algorithms.
  - Modifying `tie`'s 8-source ingestion or Gemini classification logic.
  - Changing the visual presentation of `ControlsPanel.jsx` beyond adding interactive state (loading spinners, error handling).

## Architecture & Data Flow
1. **RED ALERT**: Frontend calls `tie` `POST /threats/sync`. `tie` immediately runs a polling cycle across its sources, uses Gemini to classify new threats, and saves GeoJSON `ThreatZone`s to Firestore.
2. **OPTIMIZE FLEET**: Frontend calls `pfe` `POST /optimize`. `pfe` reads all active threats and vessel coordinates from Firestore, dynamically builds an A* routing graph/grid based on the asset positions, calculates new routes avoiding `ThreatZone` polygons, updates the database, and returns the optimized routes.
3. **SIMULATE DETOUR**: Frontend calls `pfe` `POST /simulate`. Similar to optimize, but runs in dry-run mode, returning the calculated detours to the frontend for visualization without committing them to the database.

## Tasks

### Phase 1: TIE Engine Updates
1. **Add `POST /threats/sync` to `tie/src/index.js`**
   - Import necessary logic from `scheduler.js` or `threatManager.js` to manually trigger a polling cycle.
   - Return a 202 Accepted immediately if async, or 200 OK when the cycle finishes.
   - **QA**: `curl -X POST http://localhost:3002/threats/sync` successfully forces a TIE polling cycle and updates Firestore.

### Phase 2: PFE Engine Updates
1. **Fix Listener & Add Endpoints in `pfe/src/main.py`**
   - Add `POST /optimize` to trigger `pipeline.process_threat()` for all active threats and vessels.
   - Add `POST /simulate` to trigger a dry-run calculation without committing to the database.
   - Wire `process_threat` as the callback for `start_threat_listener()` so background updates work.
2. **Dynamic Graph Generation in `pfe`**
   - Modify `main.py` and `pipeline.py` to stop relying on `app.state.graph_loaded = True` with an empty grid.
   - Fetch active vessel coordinates and active threats (GeoJSON polygons) from Firestore.
   - Construct a continuous or dynamic grid-based navigation graph on-the-fly using the database coordinates and the Shapely logic in `threat_weighter.py`.
   - **QA**: `curl -X POST http://localhost:8000/optimize` successfully reads Firestore, runs the pipeline, and returns updated routes avoiding the GeoJSON threats.

### Phase 3: Frontend Integration
1. **Wire "COMMAND AUTHORITY" Buttons in `globe/frontend/src/components/ControlsPanel.jsx`**
   - Add `onClick` handlers to `OPTIMIZE FLEET` (calls PFE `/optimize`), `RED ALERT` (calls TIE `/threats/sync`), and `SIMULATE DETOUR` (calls PFE `/simulate`).
   - Implement loading states (e.g., changing button text or adding a spinner) while the API calls are in progress.
   - Ensure the frontend properly visualizes the returned GeoJSON detour routes on the Google Photorealistic 3D Tiles globe.
   - **QA**: Clicking the buttons in the UI triggers the correct backend endpoints and handles loading/success states.

## Final Verification Wave
*Must be completed by Momus or manual user confirmation*
- [ ] `curl -X POST http://localhost:3002/threats/sync` successfully forces a TIE polling cycle and updates Firestore.
- [ ] `curl -X POST http://localhost:8000/optimize` successfully reads Firestore, runs the pipeline, and returns updated routes.
- [ ] Clicking "OPTIMIZE FLEET" in the UI triggers the PFE endpoint and shows a loading state.
- [ ] Clicking "RED ALERT" in the UI triggers the TIE endpoint.
- [ ] PFE dynamically generates its navigation graph using database coordinates instead of relying on a static JSON file.
