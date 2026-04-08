from __future__ import annotations

import time
from datetime import datetime, timezone
from collections import deque

from shapely.geometry import LineString, shape as shapely_shape

from .air_router import deflect_around_notam_blocks, interpolate_great_circle
from .astar import astar, haversine_nm
from .eta import calculate_eta
from .firebase_reader import get_all_vessels
from .firebase_writer import upsert_vessel_route
from .logger import LOG
from .threat_weighter import apply_threats_to_graph


AIRCRAFT_TYPES = {"AIRCRAFT_CARGO", "AIRCRAFT_HEAVY"}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _get_position(vessel: dict):
    pos = vessel.get("position") or {}
    return pos.get("lat"), pos.get("lon")


def _get_destination(vessel: dict):
    dest = vessel.get("destination") or {}
    return dest.get("lat"), dest.get("lon")


def _snap_to_graph(graph: dict, lat: float, lon: float):
    best = None
    best_nm = float("inf")
    for node_id, node in graph.items():
        nm = haversine_nm(lat, lon, node["lat"], node["lon"])
        if nm < best_nm:
            best = node_id
            best_nm = nm
    return best, best_nm


def _graph_connected(
    graph: dict, start_id: int, goal_id: int, edge_weights: dict
) -> bool:
    q = deque([start_id])
    seen = {start_id}
    while q:
        current = q.popleft()
        if current == goal_id:
            return True
        for edge in graph[current]["connectedTo"]:
            neighbor = edge["nodeId"]
            cost = edge_weights.get(
                (current, neighbor),
                edge_weights.get((neighbor, current), edge["distanceNm"]),
            )
            if cost >= 999999:
                continue
            if neighbor not in seen:
                seen.add(neighbor)
                q.append(neighbor)
    return False


def _build_route_section(waypoints: list[dict], eta: dict | None = None):
    section = {"waypoints": waypoints}
    if eta:
        section.update({k: eta.get(k) for k in ("distanceNm", "etaUtc") if k in eta})
    return section


def process_threat(
    threat: dict,
    vessels: list[dict] | None = None,
    graph: dict | None = None,
    db=None,
    writer=upsert_vessel_route,
    reader=get_all_vessels,
):
    vessels = vessels if vessels is not None else reader()
    graph = graph or {}
    stats = {
        "totalVessels": 0,
        "rerouted": 0,
        "blocked": 0,
        "noDestination": 0,
        "clear": 0,
    }

    for vessel in vessels:
        stats["totalVessels"] += 1
        vessel_id = vessel.get("vesselId")
        try:
            vessel_type = vessel.get("vesselType") or ""
            sog = (vessel.get("motion") or {}).get("sogKnots") or 0.0
            LOG.debug(
                {
                    "event": "VESSEL_PIPELINE_START",
                    "vesselId": vessel_id,
                    "vesselType": vessel_type,
                    "sogKnots": sog,
                }
            )

            lat, lon = _get_position(vessel)
            if lat is None or lon is None:
                LOG.warning({"event": "VESSEL_SKIP_NO_POSITION", "vesselId": vessel_id})
                continue

            if vessel_type in AIRCRAFT_TYPES:
                route = _process_air_vessel(vessel, threat, db=db, writer=writer)
            else:
                route = _process_maritime_vessel(
                    vessel, threat, vessels, graph, db=db, writer=writer
                )

            if route["routeStatus"] == "CLEAR":
                stats["clear"] += 1
            elif route["routeStatus"] == "ROUTE_BLOCKED":
                stats["blocked"] += 1
            elif route["routeStatus"] == "ROUTE_NO_DESTINATION":
                stats["noDestination"] += 1
            elif route["routeStatus"] == "REROUTED":
                stats["rerouted"] += 1
        except Exception as exc:  # pragma: no cover - integration safety
            LOG.error(
                {
                    "event": "VESSEL_PIPELINE_ERROR",
                    "vesselId": vessel_id,
                    "error": str(exc),
                }
            )

    LOG.info(
        {
            "event": "THREAT_CYCLE_COMPLETE",
            "threatId": threat.get("threatId"),
            **stats,
            "totalMs": 0,
        }
    )
    return stats


def _process_air_vessel(
    vessel: dict, threat: dict, db=None, writer=upsert_vessel_route
):
    vessel_id = vessel["vesselId"]
    lat, lon = _get_position(vessel)
    dlat, dlon = _get_destination(vessel)
    if dlat is None or dlon is None:
        route = {
            "vesselId": vessel_id,
            "routeStatus": "ROUTE_NO_DESTINATION",
            "awaitingDestinationInput": True,
            "operatorPromptMessage": f"Vessel {vessel_id} has no declared destination. Please enter destination port to enable safe rerouting.",
            "computedAtUtc": _now(),
        }
        writer(route, vessel_id=vessel_id, db=db)
        return route
    origin = {"lat": lat, "lon": lon}
    destination = {"lat": dlat, "lon": dlon}
    waypoints = interpolate_great_circle(origin, destination)
    waypoints = deflect_around_notam_blocks(waypoints, [threat], vessel_id)
    eta = calculate_eta(
        waypoints, (vessel.get("motion") or {}).get("sogKnots") or 0.0, vessel_id
    )
    route = {
        "vesselId": vessel_id,
        "routeStatus": "REROUTED",
        "originalRoute": _build_route_section(waypoints, eta),
        "newRoute": _build_route_section(waypoints, eta),
        "threatsAvoided": [threat.get("threatId")],
        "computedAtUtc": _now(),
    }
    writer(route, vessel_id=vessel_id, db=db)
    return route


def _process_maritime_vessel(
    vessel: dict,
    threat: dict,
    vessels: list[dict],
    graph: dict,
    db=None,
    writer=upsert_vessel_route,
):
    vessel_id = vessel["vesselId"]
    lat, lon = _get_position(vessel)
    dlat, dlon = _get_destination(vessel)
    projected = vessel.get("projectedPositions") or []
    threat_geom = shapely_shape(threat["geometry"])
    if projected:
        line = LineString(
            [
                (p["lon"], p["lat"])
                for p in projected
                if p.get("lat") is not None and p.get("lon") is not None
            ]
        )
        if line.is_empty or not line.intersects(threat_geom):
            route = {
                "vesselId": vessel_id,
                "routeStatus": "CLEAR",
                "computedAtUtc": _now(),
            }
            writer(route, vessel_id=vessel_id, db=db)
            return route

    if dlat is None or dlon is None:
        route = {
            "vesselId": vessel_id,
            "routeStatus": "ROUTE_NO_DESTINATION",
            "awaitingDestinationInput": True,
            "operatorPromptMessage": f"Vessel {vessel_id} has no declared destination. Please enter destination port to enable safe rerouting.",
            "computedAtUtc": _now(),
        }
        writer(route, vessel_id=vessel_id, db=db)
        return route

    start_id, start_snap = _snap_to_graph(graph, lat, lon)
    goal_id, goal_snap = _snap_to_graph(graph, dlat, dlon)
    LOG.info(
        {
            "event": "GRAPH_SNAP_RESULT",
            "vesselId": vessel_id,
            "startNodeId": start_id,
            "goalNodeId": goal_id,
            "startSnapNm": round(start_snap, 1),
            "goalSnapNm": round(goal_snap, 1),
        }
    )

    vessel_draught = (vessel.get("dimensions") or {}).get("draughtMetres")
    edge_weights = apply_threats_to_graph(graph, [threat], vessel_draught)
    if graph and not _graph_connected(graph, start_id, goal_id, edge_weights):
        route = {
            "vesselId": vessel_id,
            "routeStatus": "ROUTE_BLOCKED",
            "threatsTriggeringBlock": [threat.get("threatId")],
            "computedAtUtc": _now(),
        }
        writer(route, vessel_id=vessel_id, db=db)
        return route

    started = time.time()
    path = astar(graph, start_id, goal_id, edge_weights, vessel_id)
    if not path:
        route = {
            "vesselId": vessel_id,
            "routeStatus": "ROUTE_BLOCKED",
            "threatsTriggeringBlock": [threat.get("threatId")],
            "computedAtUtc": _now(),
        }
        writer(route, vessel_id=vessel_id, db=db)
        return route

    waypoints = [
        {"lat": graph[node_id]["lat"], "lon": graph[node_id]["lon"]} for node_id in path
    ]
    eta = calculate_eta(
        waypoints, (vessel.get("motion") or {}).get("sogKnots") or 0.0, vessel_id
    )
    route = {
        "vesselId": vessel_id,
        "routeStatus": "REROUTED",
        "originalRoute": _build_route_section(projected or waypoints, eta),
        "newRoute": {
            **_build_route_section(waypoints, eta),
            "detourNm": 0.0,
            "detourMinutes": 0.0,
        },
        "threatsAvoided": [threat.get("threatId")],
        "computedAtUtc": _now(),
        "algorithmMs": int((time.time() - started) * 1000),
    }
    writer(route, vessel_id=vessel_id, db=db)
    return route
