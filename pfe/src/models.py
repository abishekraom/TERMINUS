from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class Position(BaseModel):
    lat: float | None = None
    lon: float | None = None


class Motion(BaseModel):
    sogKnots: float | None = None
    cogDegrees: float | None = None


class Dimensions(BaseModel):
    draughtMetres: float | None = None


class Destination(BaseModel):
    lat: float | None = None
    lon: float | None = None


class VesselState(BaseModel):
    vesselId: str
    vesselType: str | None = None
    position: Position | None = None
    motion: Motion | None = None
    dimensions: Dimensions | None = None
    destination: Destination | None = None
    projectedPositions: list[dict] = Field(default_factory=list)


class ThreatClassification(BaseModel):
    threatType: str
    severity: int | float | None = None
    affectedModes: list[str] = Field(default_factory=list)


class RoutingImpact(BaseModel):
    edgeCostMultiplier: float | None = None
    isHardBlock: bool = False
    minimumSafeDistanceKm: float | None = None


class ThreatZone(BaseModel):
    threatId: str | None = None
    status: str = "ACTIVE"
    classification: ThreatClassification
    routingImpact: RoutingImpact = Field(default_factory=RoutingImpact)
    geometry: dict


class RouteSection(BaseModel):
    waypoints: list[dict]
    distanceNm: float | None = None
    etaUtc: str | None = None
    detourNm: float | None = None
    detourMinutes: float | None = None


class VesselRoute(BaseModel):
    vesselId: str
    routeStatus: Literal[
        "CLEAR",
        "REROUTING",
        "REROUTED",
        "ROUTE_BLOCKED",
        "ROUTE_NO_DESTINATION",
    ]
    originalRoute: RouteSection | None = None
    newRoute: RouteSection | None = None
    threatsAvoided: list[str] = Field(default_factory=list)
    threatsTriggeringBlock: list[str] = Field(default_factory=list)
    computedAtUtc: str | None = None
    algorithmMs: int | None = None
    awaitingDestinationInput: bool | None = None
    operatorPromptMessage: str | None = None
