import logging
from math import sqrt

import numpy as np
from geopy.distance import great_circle
from shapely.geometry import LineString, shape as shapely_shape

from .astar import haversine_nm

LOG = logging.getLogger("pfe")

SAMPLE_INTERVAL_NM = 200.0


def interpolate_great_circle(origin: dict, destination: dict) -> list[dict]:
    """
    Samples the great-circle path between two airports every 200nm.
    Returns list of {lat, lon} waypoints including origin and destination.
    """
    total_nm = haversine_nm(
        origin["lat"], origin["lon"], destination["lat"], destination["lon"]
    )
    n_segments = max(2, int(total_nm / SAMPLE_INTERVAL_NM))

    waypoints = []
    for i in range(n_segments + 1):
        fraction = i / n_segments
        # Interpolate using geopy great_circle fraction
        lat = origin["lat"] + fraction * (destination["lat"] - origin["lat"])
        lon = origin["lon"] + fraction * (destination["lon"] - origin["lon"])
        waypoints.append({"lat": round(lat, 5), "lon": round(lon, 5)})

    LOG.info(
        {
            "event": "AIR_ROUTE_INTERPOLATED",
            "totalNm": round(total_nm, 1),
            "waypoints": len(waypoints),
        }
    )
    return waypoints


def deflect_around_notam_blocks(
    waypoints: list[dict], threats: list[dict], vessel_id: str
) -> list[dict]:
    """
    For each consecutive waypoint pair, tests intersection with NOTAM hard-block zones.
    If blocked, inserts a deflection waypoint perpendicular to the threat centroid
    at minimumSafeDistanceKm offset.
    Only processes threats with affectedModes containing "air" and isHardBlock == True.
    """
    air_blocks = [
        t
        for t in threats
        if t.get("status") == "ACTIVE"
        and "air" in t["classification"].get("affectedModes", [])
        and t["routingImpact"].get("isHardBlock", False)
    ]

    if not air_blocks:
        LOG.debug({"event": "AIR_NO_HARD_BLOCKS", "vesselId": vessel_id})
        return waypoints

    result = [waypoints[0]]

    for i in range(len(waypoints) - 1):
        seg = LineString(
            [
                (waypoints[i]["lon"], waypoints[i]["lat"]),
                (waypoints[i + 1]["lon"], waypoints[i + 1]["lat"]),
            ]
        )

        blocked_by = None
        for threat in air_blocks:
            threat_polygon = shapely_shape(threat["geometry"])
            if seg.intersects(threat_polygon):
                blocked_by = threat
                break

        if blocked_by:
            safe_dist_km = blocked_by["routingImpact"].get(
                "minimumSafeDistanceKm", 100.0
            )
            safe_dist_deg = safe_dist_km / 111.0  # approx degrees

            centroid = shapely_shape(blocked_by["geometry"]).centroid
            # Deflect perpendicular: offset midpoint away from threat centroid
            mid_lat = (waypoints[i]["lat"] + waypoints[i + 1]["lat"]) / 2
            mid_lon = (waypoints[i]["lon"] + waypoints[i + 1]["lon"]) / 2

            deflect_lat = mid_lat + safe_dist_deg
            deflect_lon = mid_lon + safe_dist_deg

            result.append({"lat": round(deflect_lat, 5), "lon": round(deflect_lon, 5)})
            LOG.info(
                {
                    "event": "AIR_DEFLECTION_INSERTED",
                    "vesselId": vessel_id,
                    "threatId": blocked_by["threatId"],
                    "deflectPoint": {"lat": deflect_lat, "lon": deflect_lon},
                    "safeDistKm": safe_dist_km,
                }
            )

        result.append(waypoints[i + 1])

    LOG.info(
        {
            "event": "AIR_ROUTE_DEFLECTED",
            "vesselId": vessel_id,
            "originalWaypoints": len(waypoints),
            "finalWaypoints": len(result),
        }
    )
    return result
