import heapq
import logging
import os
from math import atan2, cos, radians, sin, sqrt

LOG = logging.getLogger("pfe")


def haversine_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance in nautical miles."""
    R = 3440.065
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    )
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


def astar(
    graph: dict, start_id: int, goal_id: int, edge_weights: dict, vessel_id: str
) -> list[int] | None:
    """
    A* over ocean waypoint graph.
    graph:        {node_id: {lat, lon, connectedTo: [{nodeId, distanceNm, minDraughtMetres}]}}
    edge_weights: {(a, b): effective_cost} — symmetric, pre-computed by threat weighter
    Returns:      ordered list of node IDs from start to goal, or None if no path exists.
    """
    open_set = []
    heapq.heappush(open_set, (0.0, start_id))
    came_from: dict[int, int] = {}
    g_score: dict[int, float] = {start_id: 0.0}
    nodes_visited = 0

    goal_lat = graph[goal_id]["lat"]
    goal_lon = graph[goal_id]["lon"]

    LOG.info(
        {
            "event": "ASTAR_START",
            "vesselId": vessel_id,
            "startNode": start_id,
            "goalNode": goal_id,
            "weightedEdges": len(edge_weights),
        }
    )

    max_nodes = int(os.getenv("ASTAR_MAX_NODES", 10000))

    while open_set:
        _, current = heapq.heappop(open_set)
        nodes_visited += 1

        if nodes_visited > max_nodes:
            LOG.error(
                {
                    "event": "ASTAR_MAX_NODES_EXCEEDED",
                    "vesselId": vessel_id,
                    "limit": max_nodes,
                }
            )
            return None

        # Balanced logging: every 10th node visited
        if nodes_visited % 10 == 0:
            LOG.debug(
                {
                    "event": "ASTAR_PROGRESS",
                    "vesselId": vessel_id,
                    "nodesVisited": nodes_visited,
                    "currentNode": current,
                    "gScore": round(g_score.get(current, 0), 1),
                }
            )

        if current == goal_id:
            LOG.info(
                {
                    "event": "ASTAR_GOAL_REACHED",
                    "vesselId": vessel_id,
                    "nodesVisited": nodes_visited,
                    "pathLength": len(_reconstruct_path(came_from, current)),
                }
            )
            return _reconstruct_path(came_from, current)

        for edge in graph[current]["connectedTo"]:
            neighbor_id = edge["nodeId"]
            # Look up pre-computed effective cost (includes threat multipliers + draught blocks)
            cost = edge_weights.get(
                (current, neighbor_id),
                edge_weights.get((neighbor_id, current), edge["distanceNm"]),
            )  # fallback to base distance if no weight override

            if cost >= 999999:
                continue

            tentative_g = g_score[current] + cost
            if tentative_g < g_score.get(neighbor_id, float("inf")):
                came_from[neighbor_id] = current
                g_score[neighbor_id] = tentative_g
                h = haversine_nm(
                    graph[neighbor_id]["lat"],
                    graph[neighbor_id]["lon"],
                    goal_lat,
                    goal_lon,
                )
                heapq.heappush(open_set, (tentative_g + h, neighbor_id))

    LOG.warning(
        {
            "event": "ASTAR_NO_PATH",
            "vesselId": vessel_id,
            "nodesVisited": nodes_visited,
            "startNode": start_id,
            "goalNode": goal_id,
        }
    )
    return None


def _reconstruct_path(came_from: dict, current: int) -> list[int]:
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return list(reversed(path))
