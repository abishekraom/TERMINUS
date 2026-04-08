from __future__ import annotations

from src.astar import astar, haversine_nm


def graph_basic():
    return {
        1: {"lat": 0.0, "lon": 0.0, "connectedTo": [{"nodeId": 2, "distanceNm": 10.0}]},
        2: {
            "lat": 0.0,
            "lon": 1.0,
            "connectedTo": [
                {"nodeId": 1, "distanceNm": 10.0},
                {"nodeId": 3, "distanceNm": 10.0},
            ],
        },
        3: {"lat": 0.0, "lon": 2.0, "connectedTo": [{"nodeId": 2, "distanceNm": 10.0}]},
    }


def test_astar_finds_correct_path_with_no_threats():
    path = astar(graph_basic(), 1, 3, {}, "v1")
    assert path == [1, 2, 3]


def test_astar_routes_around_blocked_edge():
    graph = {
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
            "lat": 0.0,
            "lon": 1.0,
            "connectedTo": [
                {"nodeId": 1, "distanceNm": 6.0},
                {"nodeId": 2, "distanceNm": 6.0},
            ],
        },
    }
    blocked = {(1, 2): 999999.0, (2, 1): 999999.0}
    assert astar(graph, 1, 2, blocked, "v2") == [1, 3, 2]


def test_astar_returns_none_when_fully_blocked():
    graph = graph_basic()
    blocked = {(1, 2): 999999.0, (2, 1): 999999.0, (2, 3): 999999.0, (3, 2): 999999.0}
    assert astar(graph, 1, 3, blocked, "v3") is None


def test_astar_aborts_at_max_nodes(monkeypatch, caplog):
    monkeypatch.setenv("ASTAR_MAX_NODES", "1")
    caplog.clear()
    graph = graph_basic()
    assert astar(graph, 1, 3, {}, "v4") is None
    assert any("ASTAR_MAX_NODES_EXCEEDED" in rec.message for rec in caplog.records)


def test_haversine_accuracy():
    sg = (1.3521, 103.8198)
    hk = (22.3193, 114.1694)
    assert abs(haversine_nm(sg[0], sg[1], hk[0], hk[1]) - 1396.4) <= 5
