# Globe Frontend Optimization Plan (Level 2)

## Objective
Optimize the Globe frontend to render >100k live vessels and aircraft concurrently without dropping below 60FPS or freezing the UI during data ingestion.

## Current Bottlenecks
1. **State Management**: Live data streams into standard React `useState` hooks (`useBackendData.js`). Every 2 seconds, this triggers a full reconciliation of the `VesselLayer` component tree.
2. **Main Thread Blocking**: Parsing JSON from WebSockets and mapping arrays blocks the main thread.
3. **Hard Limits**: `InstancedMesh` buffers in `ShipMarker` and `AircraftMarker` are hardcoded to a 40,000 limit.

## Architecture Solution (Zustand Transient + Web Worker)
We will completely bypass the React render cycle for telemetry data. 
- A Web Worker will handle the WebSocket connection, parse the JSON, and map the data into flat structures.
- The Worker sends a `postMessage` to the main thread.
- The main thread immediately commits this to a Zustand store using `useStore.getState().setTelemetry(data)` (Transient Update - NO React render).
- The `useFrame` loop in `ShipMarker` and `AircraftMarker` reads directly from `useStore.getState().telemetry` to update the `InstancedMesh` matrices on the GPU.

---

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1: Setup Transient Zustand Store | None | Foundational data layer required before hooking up producers (Worker) or consumers (Mesh). |
| Task 2: Expand InstancedMesh Limits & `useFrame` | Task 1 | Needs the Zustand store to read data from without triggering React renders. |
| Task 3: Implement Web Worker Data Pipeline | Task 1 | Needs the Zustand store to post data to. |
| Task 4: Integration & Cleanup | Task 2, Task 3 | Connects the Worker output to the UI and removes the old `useBackendData.js` logic. |

## Parallel Execution Graph

Wave 1 (Start immediately):
└── Task 1: Setup Transient Zustand Store (no dependencies)

Wave 2 (After Wave 1 completes):
├── Task 2: Expand InstancedMesh Limits & `useFrame` (depends: Task 1)
└── Task 3: Implement Web Worker Data Pipeline (depends: Task 1)

Wave 3 (After Wave 2 completes):
└── Task 4: Integration & Cleanup (depends: Task 2, Task 3)

Critical Path: Task 1 → Task 3 → Task 4

---

## Execution Tasks

### Wave 1: The State Layer
**Task 1: Setup Transient Zustand Store**
- **Category:** `deep`
- **Skills:** `[]`
- **What:** Create `globe/frontend/src/store/useTelemetryStore.js`. Define state for `vessels` and `aircraft`. Expose a `setTelemetry` function that mutates state *without* triggering component updates.
- **QA Scenario:** Write a simple Node script that imports the store, calls `useTelemetryStore.getState().setTelemetry([{id: "1", lat: 10, lon: 10}])`, and asserts the state was updated successfully.

### Wave 2: The Render & Processing Layers
**Task 2: Expand InstancedMesh & Update `useFrame`**
- **Category:** `visual-engineering`
- **Skills:** `[]`
- **What:** Modify `globe/frontend/src/components/ShipMarker.jsx` and `globe/frontend/src/components/AircraftMarker.jsx`. Increase `args={[geometry, material, 150000]}` to handle 150k limits. Refactor the `useFrame` hook to fetch data via `useTelemetryStore.getState().vessels` rather than receiving it via React props.
- **QA Scenario:** Manually inspect the modified files to ensure the `InstancedMesh` args match `150000` and the `useFrame` loops iterate over `useTelemetryStore.getState().vessels` instead of `props.vessels`.

**Task 3: Implement Data Web Worker**
- **Category:** `deep`
- **Skills:** `[]`
- **What:** Create `globe/frontend/src/workers/telemetryWorker.js`. Migrate the WebSocket connection logic out of `globe/frontend/src/hooks/useBackendData.js` and into the worker. Parse the incoming `VESSEL_UPDATES` messages. Use `postMessage` to send structured arrays back to the main thread.
- **QA Scenario:** Write a simple Node script or use `Bash` to confirm the worker file `globe/frontend/src/workers/telemetryWorker.js` exists and contains `postMessage` calls within its WebSocket message handler.

### Wave 3: Integration
**Task 4: Integration & Cleanup**
- **Category:** `quick`
- **Skills:** `[]`
- **What:** Instantiate the Web Worker in a top-level component (e.g., `globe/frontend/src/components/AppLayout.jsx` or a dedicated provider). Attach an `onmessage` listener that calls `useTelemetryStore.getState().setTelemetry(event.data)`. Delete `globe/frontend/src/hooks/useBackendData.js` entirely. Remove the `vessels` prop from `VesselLayer`, `ShipMarker`, and `AircraftMarker`.
- **QA Scenario:** Run the development server with `npm run dev` and ensure the terminal output shows no critical syntax errors or module-not-found exceptions caused by the deleted `useBackendData.js`.

---

## Final Verification Wave
*Must pause and ask the user to visually confirm the Globe runs without errors before closing the ticket.*

## Acceptance Criteria
- The application successfully connects to the data stream and renders the vessels.
- React DevTools Profiler confirms `VesselLayer` does NOT re-render when new data arrives.
- The system supports setting the density slider to maximum (pushing 100k+ entities) without crashing the browser tab.

---

> CALLER: Add these TODOs using TodoWrite/TaskCreate and execute by wave.

### Wave 1 (Start Immediately - No Dependencies)
- [ ] Task 1: Setup Transient Zustand Store

### Wave 2 (After Wave 1 Completes)
- [ ] Task 2: Expand InstancedMesh Limits & `useFrame`
- [ ] Task 3: Implement Web Worker Data Pipeline

### Wave 3 (After Wave 2 Completes)
- [ ] Task 4: Integration & Cleanup