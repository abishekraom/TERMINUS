# Filter Implementation Plan

**Goal**: Implement smooth CSS transitions for globe filters, set Normal as default, and remove unused filters.

**Scope**:
- **IN**: CRT, NVG, NOIR, NORMAL filters.
- **OUT**: FLIR, ANIME, SNOW (discard from UI).

**Technical Approach**:
1. **AppLayout State**: Change default activeMode from crt to normal.
2. **ViewModeSelector UI**: Remove FLIR, ANIME, SNOW buttons from the FILTER_MODES array.
3. **Header UI**: Pass activeMode from AppLayout to Header and display it dynamically instead of hardcoded CRT.
4. **CSS Transitions**: Add CSS classes for .filter-crt, .filter-nvg, .filter-noir with transition: opacity 0.5s ease-in-out on full-screen overlay divs.
5. **Render Overlays**: In AppLayout.jsx, render the overlay divs conditionally based on activeMode with opacity fading for smooth loading.
