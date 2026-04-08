from __future__ import annotations

import time
from datetime import datetime, timezone

from .logger import LOG

try:
    from firebase_admin import firestore
except Exception:  # pragma: no cover
    firestore = None


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def upsert_vessel_route(
    route_doc: dict,
    vessel_id: str | None = None,
    db=None,
    retries: int = 3,
    delay_s: float = 0.5,
) -> bool:
    vessel_id = vessel_id or route_doc.get("vesselId")
    if not vessel_id:
        raise ValueError("vessel_id required")

    client = db
    if client is None:
        if firestore is None:
            return False
        client = firestore.client()

    last_error = None
    for attempt in range(1, retries + 1):
        try:
            client.collection("vesselRoutes").document(vessel_id).set(route_doc)
            LOG.info(
                {
                    "event": "FIRESTORE_WRITE_SUCCESS",
                    "vesselId": vessel_id,
                    "routeStatus": route_doc.get("routeStatus"),
                    "path": f"/vesselRoutes/{vessel_id}",
                    "writeMs": 0,
                }
            )
            return True
        except Exception as exc:  # pragma: no cover - exercised via mocks
            last_error = exc
            if attempt < retries:
                time.sleep(delay_s)

    LOG.error(
        {
            "event": "FIRESTORE_WRITE_FAILED",
            "vesselId": vessel_id,
            "attempts": retries,
            "lastError": str(last_error),
        }
    )
    return False
