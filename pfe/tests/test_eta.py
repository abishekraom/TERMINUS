from __future__ import annotations

from src import eta as eta_mod


def test_eta_unavailable_when_sog_zero():
    result = eta_mod.calculate_eta(
        [{"lat": 0.0, "lon": 0.0}, {"lat": 0.0, "lon": 1.0}], 0.0, "v1"
    )
    assert result["etaUtc"] is None
    assert result["etaConfidence"] == "UNAVAILABLE"


def test_eta_accuracy(monkeypatch):
    monkeypatch.setattr(eta_mod, "haversine_nm", lambda *args, **kwargs: 250.0)
    result = eta_mod.calculate_eta(
        [{"lat": 0.0, "lon": 0.0}, {"lat": 1.0, "lon": 1.0}, {"lat": 2.0, "lon": 2.0}],
        12.5,
        "v2",
    )
    assert result["distanceNm"] == 500.0
    assert abs(result["etaHours"] - 43.2) <= 2.2
