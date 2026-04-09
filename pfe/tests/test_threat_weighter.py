from __future__ import annotations

from src.threat_weighter import apply_threats_to_graph


def graph_two_nodes():
    return {
        1: {
            "lat": 0.0,
            "lon": 0.0,
            "connectedTo": [
                {"nodeId": 2, "distanceNm": 10.0, "minDraughtMetres": 20.0}
            ],
        },
        2: {
            "lat": 0.0,
            "lon": 2.0,
            "connectedTo": [
                {"nodeId": 1, "distanceNm": 10.0, "minDraughtMetres": 20.0}
            ],
        },
    }


def threat(multiplier=4.0, hard_block=False):
    return {
        "threatId": "t1",
        "status": "ACTIVE",
        "classification": {
            "threatType": "WEATHER",
            "severity": 4,
            "affectedModes": ["maritime"],
        },
        "routingImpact": {"edgeCostMultiplier": multiplier, "isHardBlock": hard_block},
        "geometry": {
            "type": "Polygon",
            "coordinates": [[(0.9, -1), (0.9, 1), (1.1, 1), (1.1, -1), (0.9, -1)]],
        },
    }


def test_threat_applies_correct_multiplier():
    weights = apply_threats_to_graph(graph_two_nodes(), [threat()], None)
    assert weights[(1, 2)] == 40.0
    assert weights[(2, 1)] == 40.0


def test_hard_block_sets_edge_to_999999():
    weights = apply_threats_to_graph(
        graph_two_nodes(), [threat(multiplier=2.0, hard_block=True)], None
    )
    assert weights[(1, 2)] == 999999.0


def test_missing_multiplier_uses_1_0(monkeypatch, caplog):
    t = threat(multiplier=None)
    t["routingImpact"].pop("edgeCostMultiplier")
    weights = apply_threats_to_graph(graph_two_nodes(), [t], None)
    assert weights[(1, 2)] == 10.0
    assert any("THREAT_MISSING_MULTIPLIER" in str(rec.msg) for rec in caplog.records)


def test_draught_blocks_malacca_for_vlcc():
    weights = apply_threats_to_graph(graph_two_nodes(), [], 21.5)
    assert weights[(1, 2)] == 999999.0


def test_draught_allows_shallow_for_small_vessel():
    weights = apply_threats_to_graph(graph_two_nodes(), [], 8.0)
    assert (1, 2) not in weights
