# Filter Implementation Plan

## Objective
Clean up the filter selection menu to only include Normal, CRT, NVG, and NOIR. Set the default to Normal. Implement CSS-based visual filters for the active modes instead of complex WebGL post-processing.

## Scope
- IN: Updating globe/frontend/src/components/ViewModeSelector.jsx options.
- IN: Modifying default state in globe/frontend/src/components/AppLayout.jsx.
- IN: Passing ctiveMode to globe/frontend/src/components/Header.jsx to dynamically update the "ACTIVE STYLE" badge.
- IN: Creating CSS classes for the visual effects in globe/frontend/src/index.css.
- IN: Conditionally applying CSS classes to the main application wrapper based on ctiveMode.
- OUT: WebGL shaders or @react-three/postprocessing (Explicitly chosen CSS approach for simplicity).

## Technical Approach
1. **State & UI Cleanup**: The local state ctiveMode in AppLayout will default to 'normal'. The FILTER_MODES array in ViewModeSelector will be trimmed down. Header will accept ctiveMode as a prop and display it uppercase.
2. **Visual Implementation (CSS)**: We will apply a top-level CSS class to the main div in AppLayout.jsx (e.g., `className={lex-1 relative overflow-hidden }`).
3. **Scanlines Overlay**: The existing <div className="scanlines-overlay" /> in AppLayout.jsx should only be rendered conditionally when ctiveMode is 'crt' or 'nvg'.
4. **CSS Filters**: Define the following classes in globe/frontend/src/index.css:
   - .filter-crt: ilter: sepia(0.6) hue-rotate(-30deg) saturate(1.5) contrast(1.2); (amber/orange tint)
   - .filter-nvg: ilter: sepia(1) hue-rotate(50deg) saturate(3) brightness(1.2) contrast(1.5); (classic green night vision)
   - .filter-noir: ilter: grayscale(1) contrast(1.5) brightness(0.9); (black and white film)

## Step-by-Step Implementation

### Task 1: Clean up ViewModeSelector and AppLayout State
- Open globe/frontend/src/components/ViewModeSelector.jsx.
- Remove the objects for lir, nime, and snow from the FILTER_MODES array.
- Open globe/frontend/src/components/AppLayout.jsx.
- Change const [activeMode, setActiveMode] = useState('crt'); to useState('normal');.
- **QA Scenario**: Ensure the app loads without errors and the filter menu only shows CRT, NVG, and Noir. Ensure the "Normal" button is highlighted on load.

### Task 2: Dynamic Header Badge
- Open globe/frontend/src/components/AppLayout.jsx.
- Update the <Header /> instantiation to pass the active mode: <Header activeMode={activeMode} />.
- Open globe/frontend/src/components/Header.jsx.
- Accept ctiveMode as a prop: export default function Header({ activeMode = 'normal' }).
- Find the hardcoded <span className="text-amber font-bold tracking-wider text-glow-amber">CRT</span>.
- Replace "CRT" with {activeMode.toUpperCase()}.
- **QA Scenario**: Change the filter in the UI. Verify the text in the top right header changes to match (e.g., "NVG").

### Task 3: Implement CSS Filters and Scanlines Overlay Logic
- Open globe/frontend/src/index.css.
- Add the new filter classes at the bottom:
  `css
  .filter-crt { filter: sepia(0.6) hue-rotate(-30deg) saturate(1.5) contrast(1.2); }
  .filter-nvg { filter: sepia(1) hue-rotate(50deg) saturate(3) brightness(1.2) contrast(1.5); }
  .filter-noir { filter: grayscale(1) contrast(1.5) brightness(0.9); }
  `
- Open globe/frontend/src/components/AppLayout.jsx.
- Add the dynamic class to the wrapper div holding the canvas (the second main div, class "flex-1 relative overflow-hidden").
- Modify the scanlines-overlay element to be conditional:
  {(activeMode === 'crt' || activeMode === 'nvg') && <div className="scanlines-overlay" />}
- **QA Scenario**: Click 'NVG'. Verify the screen turns green and scanlines appear. Click 'NOIR'. Verify the screen turns black and white and scanlines disappear. Click 'NORMAL'. Verify colors return to normal and no scanlines.

## Final Verification Wave
Review the entire app manually by running 
pm run dev in the globe/frontend folder and clicking through the filters. Verify no remnants of FLIR, ANIME, or SNOW exist in the UI or codebase.
