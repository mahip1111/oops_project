#pragma once
#include <string>
#include <vector>
#include <cmath>
#include <iomanip>
#include <sstream>
#include <algorithm>

struct SimulationConfig {
    int orderCount;         // e.g., 50000
    int workerCount;        // e.g., 30 or 40
    std::vector<std::string> activeHubs; // e.g. {"DEL-01", "BOM-04", "HYD-02", "CCU-03"}
    std::string strategy;   // "FIFO", "Priority", "Deadline", "Hybrid"
    double expressOrderPct; // e.g., 25%
};

struct HubSimulationStats {
    std::string hubId;
    std::string hubName;
    int ordersAssigned;
    double utilizationPct;
    double avgLatencyMs;
};

struct SimulationResult {
    int totalOrders;
    int workerCount;
    int activeHubCount;
    std::string strategyName;
    double estimatedCompletionHours;
    int lateOrdersCount;
    double slaAdherencePct;
    double throughputPerHour;
    double avgOrderFulfillmentMins;
    double workerUtilizationPct;
    std::string bottleneckNode;
    std::string recommendation;
    std::vector<HubSimulationStats> hubStats;
};

class Simulator {
public:
    static SimulationResult run(const SimulationConfig& config) {
        int N = std::max(1, config.orderCount);
        int W = std::max(1, config.workerCount);
        int H = std::max(1, static_cast<int>(config.activeHubs.size()));

        double baseTaskSecondsPerOrder = 44.0;
        double strategyEfficiencyFactor = 1.0;
        double slaProtectionFactor = 1.0;
        std::string stratName = config.strategy.empty() ? "Hybrid" : config.strategy;

        if (stratName == "Hybrid" || stratName == "PRIORITY_EDF") {
            strategyEfficiencyFactor = 0.93;
            slaProtectionFactor = 0.30;
            stratName = "Hybrid (Dynamic Priority + Deadline Signals)";
        } else if (stratName == "Priority") {
            strategyEfficiencyFactor = 0.95;
            slaProtectionFactor = 0.40;
            stratName = "Priority-First (Urgent)";
        } else if (stratName == "Deadline") {
            strategyEfficiencyFactor = 0.94;
            slaProtectionFactor = 0.35;
            stratName = "Deadline (Earliest Deadline First)";
        } else {
            stratName = "FIFO (First-In, First-Out)";
        }

        double totalWorkSeconds = N * baseTaskSecondsPerOrder * strategyEfficiencyFactor;
        double hubCoordinationFactor = 1.0 + (0.04 * std::max(0, 4 - H));
        double completionHours = (totalWorkSeconds / (3600.0 * W)) * hubCoordinationFactor;

        double loadRatio = static_cast<double>(N) / (W * 1250.0);
        double baseLateRate = 0.015;
        if (loadRatio > 1.0) {
            baseLateRate += (loadRatio - 1.0) * 0.055;
        }

        int calculatedLateOrders = static_cast<int>(std::round(N * baseLateRate * slaProtectionFactor));
        calculatedLateOrders = std::max(12, std::min(N, calculatedLateOrders));

        double slaPct = (1.0 - (static_cast<double>(calculatedLateOrders) / N)) * 100.0;
        double throughput = completionHours > 0.0 ? (N / completionHours) : 0.0;
        double avgFulfillmentMins = std::max(6.0, (completionHours * 60.0 / (N / static_cast<double>(W))) * 1.8);
        double workerUtil = std::min(99.4, 75.0 + (loadRatio * 18.0));

        std::vector<HubSimulationStats> hubs;
        std::vector<std::pair<std::string, std::string>> allHubs = {
            {"BOM-04", "Mumbai MegaPort"},
            {"DEL-01", "Delhi SuperHub"},
            {"HYD-02", "Hyderabad Cyber Node"},
            {"CCU-03", "Kolkata Gateway"}
        };

        std::string bottleneck = "None (Balanced)";
        double maxHubLoad = 0;

        for (const auto& hubPair : allHubs) {
            bool isActive = std::find(config.activeHubs.begin(), config.activeHubs.end(), hubPair.first) != config.activeHubs.end();
            if (isActive) {
                double hubWeight = (hubPair.first == "BOM-04" ? 0.35 : (hubPair.first == "DEL-01" ? 0.30 : (hubPair.first == "HYD-02" ? 0.20 : 0.15)));
                int assigned = static_cast<int>(N * hubWeight * (4.0 / H));
                double util = std::min(98.5, 60.0 + (assigned / 600.0));
                hubs.push_back({hubPair.first, hubPair.second, assigned, util, 1.2});
                if (util > maxHubLoad) {
                    maxHubLoad = util;
                    bottleneck = hubPair.second + " (" + hubPair.first + ")";
                }
            }
        }

        std::stringstream ss;
        if (W < 35 && N >= 40000) {
            ss << "Adding 10 workers reduces completion time from " << std::fixed << std::setprecision(1) << completionHours 
               << "h to ~" << (completionHours * 0.75) << "h and cuts late orders by ~65%.";
        } else if (config.strategy == "FIFO") {
            ss << "Switching to Hybrid / Deadline scheduling cuts late orders by ~70% with current " << W << " workers.";
        } else {
            ss << "Configuration is operating at optimal efficiency (" << std::fixed << std::setprecision(1) << slaPct << "% SLA adherence).";
        }

        return {
            N,
            W,
            H,
            stratName,
            std::round(completionHours * 10.0) / 10.0,
            calculatedLateOrders,
            std::round(slaPct * 100.0) / 100.0,
            std::round(throughput),
            std::round(avgFulfillmentMins * 10.0) / 10.0,
            std::round(workerUtil * 10.0) / 10.0,
            bottleneck,
            ss.str(),
            hubs
        };
    }
};
