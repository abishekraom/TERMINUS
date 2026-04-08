import logging

from shapely.geometry import LineString, shape as shapely_shape

LOG = logging.getLogger("pfe")


def apply_threats_to_graph(
    graph: dict, threats: list[dict], vessel_draught: float | None
) -> dict:
    """
    Returns edge_weights dict: {(nodeA, nodeB): effective_cost}
    Only edges intersecting threat zones or violating draught constraints are included.
    Unweighted edges fall back to base distanceNm inside astar().
    """
    edge_weights = {}

    for threat in threats:
        if threat.get("status") != "ACTIVE":
            continue

        routing_impact = threat.get("routingImpact", {})
        multiplier = routing_impact.get("edgeCostMultiplier")
        if multiplier is None:
            LOG.warning(
                {
                    "event": "THREAT_MISSING_MULTIPLIER",
                    "threatId": threat["threatId"],
                    "defaultApplied": 1.0,
                }
            )
            multiplier = 1.0

        is_hard_block = routing_impact.get("isHardBlock", False)
        threat_polygon = shapely_shape(
            threat["geometry"]
        )  # already a Polygon per TIE contract
        edges_affected = 0

        for node_id, node in graph.items():
            for edge in node["connectedTo"]:
                neighbor_id = edge["nodeId"]
                if (node_id, neighbor_id) in edge_weights:
                    continue  # already processed this edge

                # Build edge as LineString and test intersection
                edge_line = LineString(
                    [
                        (node["lon"], node["lat"]),
                        (graph[neighbor_id]["lon"], graph[neighbor_id]["lat"]),
                    ]
                )

                if edge_line.intersects(threat_polygon):
                    cost = (
                        999999.0 if is_hard_block else edge["distanceNm"] * multiplier
                    )
                    edge_weights[(node_id, neighbor_id)] = cost
                    edge_weights[(neighbor_id, node_id)] = cost  # symmetric
                    edges_affected += 1

        LOG.debug(
            {
                "event": "THREAT_EDGE_WEIGHTED",
                "threatId": threat["threatId"],
                "threatType": threat["classification"]["threatType"],
                "severity": threat["classification"]["severity"],
                "multiplier": multiplier,
                "isHardBlock": is_hard_block,
                "edgesAffected": edges_affected,
            }
        )

    # Apply draught constraints on top of threat weights
    if vessel_draught:
        for node_id, node in graph.items():
            for edge in node["connectedTo"]:
                neighbor_id = edge["nodeId"]
                min_d = edge.get("minDraughtMetres", 0.0)
                if min_d > 0 and vessel_draught > min_d:
                    edge_weights[(node_id, neighbor_id)] = 999999.0
                    edge_weights[(neighbor_id, node_id)] = 999999.0
                    LOG.debug(
                        {
                            "event": "DRAUGHT_EDGE_BLOCKED",
                            "nodeA": node_id,
                            "nodeB": neighbor_id,
                            "vesselDraught": vessel_draught,
                            "edgeMinDraught": min_d,
                        }
                    )

    return edge_weights
