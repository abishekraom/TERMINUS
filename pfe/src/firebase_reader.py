from __future__ import annotations

import time

from .logger import LOG

try:
    from firebase_admin import db as rtdb
except Exception:  # pragma: no cover
    rtdb = None


def get_all_vessels(
    rtdb_ref=None, retries: int = 3, delay_s: float = 0.5
) -> list[dict]:
    ref = rtdb_ref
    if ref is None:
        if rtdb is None:
            return []
        ref = rtdb.reference("/vessels")

    last_error = None
    for attempt in range(1, retries + 1):
        try:
            raw = ref.get()
            if not raw:
                LOG.warning({"event": "NO_VESSELS_IN_DB"})
                return []

            vessels = []
            for vessel_id, data in raw.items():
                state = (data or {}).get("state")
                if state:
                    state = dict(state)
                    state["vesselId"] = vessel_id
                    vessels.append(state)

            LOG.info({"event": "VESSELS_READ", "count": len(vessels)})
            return vessels
        except Exception as exc:  # pragma: no cover - exercised via mocks
            last_error = exc
            if attempt < retries:
                time.sleep(delay_s)

    LOG.error({"event": "VESSELS_READ_FAILED", "error": str(last_error)})
    return []
