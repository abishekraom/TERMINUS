from __future__ import annotations

from src.pipeline import process_threat


def graph_detour():
    return {
        1: {
            "lat": 0.0,
            "lon": 0.0,
            "connectedTo": [
                {"nodeId": 2, "distanceNm": 10.0},
                {"nodeId": 3, "distanceNm": 6.0},
            ],
        },
        2: {
            "lat": 0.0,
            "lon": 2.0,
            "connectedTo": [
                {"nodeId": 1, "distanceNm": 10.0},
                {"nodeId": 3, "distanceNm": 6.0},
            ],
        },
        3: {
            "lat": 1.0,
            "lon": 1.0,
            "connectedTo": [
                {"nodeId": 1, "distanceNm": 6.0},
                {"nodeId": 2, "distanceNm": 6.0},
            ],
        },
    }


def threat():
    return {
        "threatId": "th1",
        "status": "ACTIVE",
        "classification": {
            "threatType": "WEATHER",
            "severity": 4,
            "affectedModes": ["maritime"],
        },
        "routingImpact": {"edgeCostMultiplier": 4.0, "isHardBlock": True},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [(0.45, -0.2), (0.45, 0.2), (0.55, 0.2), (0.55, -0.2), (0.45, -0.2)]
            ],
        },
    }


def vessel_no_destination():
    return {
        "vesselId": "v1",
        "vesselType": "CARGO",
        "position": {"lat": 0.0, "lon": 0.0},
        "motion": {"sogKnots": 10.0},
        "projectedPositions": [{"lat": 0.0, "lon": 0.0}, {"lat": 0.0, "lon": 2.0}],
        "destination": {"lat": None, "lon": None},
        "dimensions": {"draughtMetres": 8.0},
    }


def vessel_reroute():
    return {
        "vesselId": "v2",
        "vesselType": "CARGO",
        "position": {"lat": 0.0, "lon": 0.0},
        "motion": {"sogKnots": 12.0},
        "projectedPositions": [{"lat": 0.0, "lon": 0.0}, {"lat": 0.0, "lon": 2.0}],
        "destination": {"lat": 0.0, "lon": 2.0},
        "dimensions": {"draughtMetres": 8.0},
    }


def vessel_bad_position():
    return {
        "vesselId": "bad",
        "vesselType": "CARGO",
        "position": {"lat": None, "lon": None},
        "motion": {"sogKnots": 12.0},
        "projectedPositions": [],
        "destination": {"lat": 0.0, "lon": 2.0},
    }


def test_no_destination_written(monkeypatch):
    writes = []

    def writer(doc, vessel_id=None, db=None):
        writes.append(doc)
        return True

    stats = process_threat(
        threat(),
        vessels=[vessel_no_destination()],
        graph=graph_detour(),
        writer=writer,
        reader=lambda: [],
    )
    assert stats["noDestination"] == 1
    assert writes[0]["routeStatus"] == "ROUTE_NO_DESTINATION"
    assert writes[0]["awaitingDestinationInput"] is True


def test_full_maritime_reroute_cycle():
    writes = []

    def writer(doc, vessel_id=None, db=None):
        writes.append(doc)
        return True

    stats = process_threat(
        threat(),
        vessels=[vessel_reroute()],
        graph=graph_detour(),
        writer=writer,
        reader=lambda: [],
    )
    assert stats["rerouted"] == 1
    assert writes[0]["routeStatus"] == "REROUTED"
    assert len(writes[0]["newRoute"]["waypoints"]) >= 2


def test_bad_vessel_does_not_crash_pipeline():
    writes = []

    def writer(doc, vessel_id=None, db=None):
        writes.append(doc)
        return True

    stats = process_threat(
        threat(),
        vessels=[vessel_bad_position(), vessel_reroute()],
        graph=graph_detour(),
        writer=writer,
        reader=lambda: [],
    )
    assert stats["totalVessels"] == 2
    assert stats["rerouted"] == 1
    assert len(writes) == 1
