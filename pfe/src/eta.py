import logging
import os
from datetime import datetime, timedelta, timezone

LOG = logging.getLogger("pfe")

ETA_ROUTING_FACTOR = float(os.getenv("ETA_ROUTING_FACTOR", 1.08))


def haversine_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    from math import atan2, cos, radians, sin, sqrt

    R = 3440.065
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


def calculate_eta(waypoints: list[dict], sog_knots: float, vessel_id: str) -> dict:
    total_nm = sum(
        haversine_nm(
            waypoints[i]["lat"],
            waypoints[i]["lon"],
            waypoints[i + 1]["lat"],
            waypoints[i + 1]["lon"],
        )
        for i in range(len(waypoints) - 1)
    )

    if sog_knots < 0.5:
        LOG.warning(
            {
                "event": "ETA_UNAVAILABLE",
                "vesselId": vessel_id,
                "sogKnots": sog_knots,
                "reason": "Vessel not underway",
            }
        )
        return {
            "distanceNm": round(total_nm, 1),
            "etaUtc": None,
            "etaHours": None,
            "etaConfidence": "UNAVAILABLE",
        }

    adjusted_nm = total_nm * ETA_ROUTING_FACTOR
    eta_hours = adjusted_nm / sog_knots
    eta_dt = datetime.now(timezone.utc) + timedelta(hours=eta_hours)

    LOG.info(
        {
            "event": "ETA_CALCULATED",
            "vesselId": vessel_id,
            "distanceNm": round(total_nm, 1),
            "sogKnots": sog_knots,
            "etaHours": round(eta_hours, 2),
            "etaUtc": eta_dt.isoformat(),
            "routingFactor": ETA_ROUTING_FACTOR,
        }
    )

    return {
        "distanceNm": round(total_nm, 1),
        "etaUtc": eta_dt.isoformat(),
        "etaHours": round(eta_hours, 2),
        "etaConfidence": "HIGH" if sog_knots > 2.0 else "MEDIUM",
    }
