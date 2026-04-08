from __future__ import annotations

from src.air_router import deflect_around_notam_blocks, interpolate_great_circle


def test_air_great_circle_waypoint_count():
    origin = {"lat": 1.3521, "lon": 103.8198}
    destination = {"lat": 51.5074, "lon": -0.1278}
    waypoints = interpolate_great_circle(origin, destination)
    assert 30 <= len(waypoints) <= 50
    assert waypoints[0] == {"lat": 1.3521, "lon": 103.8198}
    assert waypoints[-1] == {"lat": 51.5074, "lon": -0.1278}


def test_air_notam_deflection_inserts_waypoint():
    waypoints = [{"lat": 0.0, "lon": 0.0}, {"lat": 0.0, "lon": 2.0}]
    threats = [
        {
            "threatId": "n1",
            "status": "ACTIVE",
            "classification": {"affectedModes": ["air"]},
            "routingImpact": {"isHardBlock": True, "minimumSafeDistanceKm": 111.0},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[(0.9, -1), (0.9, 1), (1.1, 1), (1.1, -1), (0.9, -1)]],
            },
        }
    ]
    result = deflect_around_notam_blocks(waypoints, threats, "air1")
    assert len(result) == 3
    assert result[1] == {"lat": 1.0, "lon": 2.0}
