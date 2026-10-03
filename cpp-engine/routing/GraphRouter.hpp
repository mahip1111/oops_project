#pragma once
#include <string>
#include <vector>
#include <unordered_map>

/**
 * @struct RouteEdge
 * @brief Directed edge between nodes in the logistics graph.
 */
struct RouteEdge {
    std::string toNode;
    double latencyMs;
    double distanceKm;
};

/**
 * @struct RouteResult
 * @brief Output metrics computed by Dijkstra's shortest-path algorithm.
 */
struct RouteResult {
    std::vector<std::string> path;
    double totalLatencyMs;
    double totalDistanceKm;
    std::string optimalHub;
};

/**
 * @class GraphRouter
 * @brief Graph data structure and Dijkstra Shortest-Path route optimization engine O(E + V log V).
 */
class GraphRouter {
private:
    std::unordered_map<std::string, std::vector<RouteEdge>> adjacencyList;

public:
    GraphRouter();

    void addEdge(const std::string& from, const std::string& to, double latency, double dist);
    RouteResult findOptimalRoute(const std::string& destination);
};
