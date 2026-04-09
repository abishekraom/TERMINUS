from __future__ import annotations

import os

from fastapi import FastAPI, Response, status

from .listener import start_threat_listener
from .logger import LOG

app = FastAPI(title="PFE API")
app.state.graph_loaded = True
app.state.listener_watch = None


@app.on_event("startup")
def startup():
    try:
        app.state.listener_watch = start_threat_listener()
    except Exception as exc:  # pragma: no cover
        app.state.listener_watch = None
        app.state.graph_loaded = False
        LOG.error({"event": "GRAPH_LOAD_FAILED", "error": str(exc)})


@app.get("/health")
def health():
    if not getattr(app.state, "graph_loaded", False):
        return Response(
            content='{"status":"degraded","service":"pfe"}',
            media_type="application/json",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    return {"status": "ok", "service": "pfe", "graphLoaded": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("src.main:app", host="0.0.0.0", port=int(os.getenv("PORT", 3003)))
