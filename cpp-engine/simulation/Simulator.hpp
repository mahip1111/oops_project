#pragma once
#include <string>
#include <vector>

/**
 * @struct SimulationConfig
 * @brief Configuration parameters for What-If fulfillment workload simulations.
 */
struct SimulationConfig {
    int orderCount;                     ///< Total simulated batch orders (e.g. 50,000)
    int workerCount;                    ///< Active worker & AGV fleet size (e.g. 30 or 40)
    std::vector<std::string> activeHubs; ///< Registered distribution hubs {"DEL-01", "BOM-04", "HYD-02", "CCU-03"}
    std::string strategy;               ///< Scheduling strategy ("FIFO", "Priority", "Deadline", "Hybrid")
    double expressOrderPct;             ///< Percentage of high-urgency express orders (default 25%)
};

/**
 * @struct HubSimulationStats
 * @brief Telemetry metrics for a specific regional distribution hub under simulated load.
 */
struct HubSimulationStats {
    std::string hubId;
    std::string hubName;
    int ordersAssigned;
    double utilizationPct;
    double avgLatencyMs;
};

/**
 * @struct SimulationResult
 * @brief Comprehensive results produced by the What-If simulation engine.
 */
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

/**
 * @class Simulator
 * @brief High-performance analytical simulation engine for capacity forecasting and algorithm benchmarking.
 */
class Simulator {
public:
    static SimulationResult run(const SimulationConfig& config);
    static std::vector<SimulationResult> runComparison(int orderCount, 
                                                       int workerCount, 
                                                       const std::vector<std::string>& activeHubs);
};
