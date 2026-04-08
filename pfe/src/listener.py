from __future__ import annotations

import asyncio

from .logger import LOG

try:
    from firebase_admin import firestore
except Exception:  # pragma: no cover
    firestore = None


def start_threat_listener(db=None, process_threat_callback=None):
    client = db
    if client is None:
        if firestore is None:
            return None
        client = firestore.client()

    collection = client.collection("threats")
    query = collection.where("status", "==", "ACTIVE")

    def on_snapshot(col_snapshot, changes, read_time):
        for change in changes:
            if getattr(change.type, "name", None) in ("ADDED", "MODIFIED"):
                threat = change.document.to_dict() or {}
                threat["threatId"] = change.document.id
                LOG.info(
                    {
                        "event": "THREAT_RECEIVED",
                        "threatId": threat["threatId"],
                        "threatType": threat.get("classification", {}).get(
                            "threatType"
                        ),
                        "severity": threat.get("classification", {}).get("severity"),
                        "changeType": getattr(change.type, "name", None),
                    }
                )
                if process_threat_callback:
                    try:
                        loop = asyncio.get_running_loop()
                        if asyncio.iscoroutinefunction(process_threat_callback):
                            loop.create_task(process_threat_callback(threat))
                        else:
                            process_threat_callback(threat)
                    except RuntimeError:
                        if asyncio.iscoroutinefunction(process_threat_callback):
                            asyncio.run(process_threat_callback(threat))
                        else:
                            process_threat_callback(threat)

    watch = query.on_snapshot(on_snapshot)
    LOG.info(
        {
            "event": "THREAT_LISTENER_STARTED",
            "collection": "threats",
            "filter": "status==ACTIVE",
        }
    )
    return watch
