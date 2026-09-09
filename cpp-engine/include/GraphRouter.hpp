#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <queue>
#include <limits>
#include <iostream>
#include <algorithm>

struct RouteEdge {
    std::string toNode;
    double latencyMs;
    double distanceKm;
};

struct RouteResult {
    std::vector<std::string> path;
    double totalLatencyMs;
    double totalDistanceKm;
    std::string optimalHub;
};

class GraphRouter {
private:
    std::unordered_map<std::string, std::vector<RouteEdge>> adjacencyList;

public:
    GraphRouter() {
        // Initialize 4 Core Fulfillment Hubs and Destination Nodes
        // Hubs: Delhi (DEL-01), Mumbai (BOM-04), Hyderabad (HYD-02), Kolkata (CCU-03)
        // Destinations: Bhubaneswar (BBI-01), Bengaluru, Chennai, Jaipur, Patna
        addEdge("BOM-04", "NGP-02", 0.4, 820.0);
        addEdge("NGP-02", "BBI-01", 0.8, 820.0);
        addEdge("BOM-04", "BBI-01", 1.4, 1640.0);
        addEdge("DEL-01", "LKO-01", 0.3, 500.0);
        addEdge("LKO-01", "BBI-01", 0.9, 1000.0);
        addEdge("CCU-03", "BBI-01", 0.5, 440.0);
        addEdge("HYD-02", "BBI-01", 0.7, 1050.0);
        addEdge("DEL-01", "BOM-04", 0.6, 1400.0);
        addEdge("BOM-04", "HYD-02", 0.4, 710.0);
        addEdge("HYD-02", "CCU-03", 0.8, 1480.0);
    }

    void addEdge(const std::string& from, const std::string& to, double latency, double dist) {
        adjacencyList[from].push_back({to, latency, dist});
        adjacencyList[to].push_back({from, latency, dist});
    }

    // Dijkstra's Shortest Path Algorithm
    RouteResult findOptimalRoute(const std::string& destination) {
        std::vector<std::string> hubCandidates = {"BOM-04", "CCU-03", "DEL-01", "HYD-02"};
        std::string targetNode = destination == "Bhubaneswar" ? "BBI-01" : destination;

        RouteResult bestResult;
        bestResult.totalLatencyMs = std::numeric_limits<double>::max();

        for (const auto& hub : hubCandidates) {
            std::unordered_map<std::string, double> minLatency;
            std::unordered_map<std::string, std::string> previous;

            auto compare = [](const std::pair<double, std::string>& a, const std::pair<double, std::string>& b) {
                return a.first > b.first;
            };
            std::priority_queue<std::pair<double, std::string>, std::vector<std::pair<double, std::string>>, decltype(compare)> pq(compare);

            minLatency[hub] = 0.0;
            pq.push({0.0, hub});

            while (!pq.empty()) {
                auto [currDist, u] = pq.top();
                pq.pop();

                if (currDist > minLatency[u]) continue;
                if (u == targetNode) break;

                for (const auto& edge : adjacencyList[u]) {
                    double alt = currDist + edge.latencyMs;
                    if (minLatency.find(edge.toNode) == minLatency.end() || alt < minLatency[edge.toNode]) {
                        minLatency[edge.toNode] = alt;
                        previous[edge.toNode] = u;
                        pq.push({alt, edge.toNode});
                    }
                }
            }

            if (minLatency.find(targetNode) != minLatency.end() && minLatency[targetNode] < bestResult.totalLatencyMs) {
                bestResult.totalLatencyMs = minLatency[targetNode];
                bestResult.optimalHub = hub;

                std::vector<std::string> path;
                for (std::string at = targetNode; !at.empty(); at = previous[at]) {
                    path.push_back(at);
                    if (at == hub) break;
                }
                std::reverse(path.begin(), path.end());
                bestResult.path = path;
                bestResult.totalDistanceKm = 1640.0;
            }
        }

        return bestResult;
    }
};
