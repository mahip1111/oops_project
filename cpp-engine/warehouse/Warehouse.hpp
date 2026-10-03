#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include <memory>
#include <utility>
#include "core/Compat.hpp"

/**
 * @struct WarehouseEvaluationResult
 * @brief Output metrics when scoring a warehouse candidate for fulfillment.
 */
struct WarehouseEvaluationResult {
    std::string hubId;
    std::string hubName;
    bool isEligible;
    std::string ineligibilityReason;
    double distanceKm;
    double distanceCost;      // Lower is better
    double workloadCost;      // Higher utilization = higher cost
    double processingCost;    // Base handling latency cost
    double shippingCost;      // Shipping tariff
    double totalCostScore;    // Composite Fulfillment Cost (Lower is better!)
    std::string explanation;
};

/**
 * @class Warehouse
 * @brief Regional distribution SuperHub entity with local stock, capacity, and scoring algorithms.
 */
class Warehouse {
private:
    std::string id;
    std::string name;
    std::string city;
    int capacity;
    int activeOrders;
    int baseProcessingTimeSec;
    double baseShippingRatePerKm;
    std::unordered_map<std::string, int> inventory; // SKU -> count
    mutable std::unique_ptr<std::mutex> warehouseMutex;

public:
    Warehouse(std::string wId, std::string wName, std::string wCity, int cap, int currentOrders,
              int procTimeSec = 24, double shippingRate = 0.45);

    Warehouse(const Warehouse& other);
    Warehouse(Warehouse&& other) noexcept;
    Warehouse& operator=(const Warehouse& other);

    void setStock(const std::string& sku, int qty);
    int getStock(const std::string& sku) const;
    double getUtilization() const;

    bool checkInventoryEligibility(const std::vector<std::pair<std::string, int>>& requiredItems, 
                                   std::string& outReason) const;

    WarehouseEvaluationResult evaluateFulfillmentCost(
        const std::vector<std::pair<std::string, int>>& requiredItems, double distanceKm) const;

    bool reserveStock(const std::string& sku, int quantity);
    void releaseStock(const std::string& sku, int quantity);

    // Getters
    std::string getId() const;
    std::string getName() const;
    std::string getCity() const;
    int getCapacity() const;
    int getActiveOrders() const;
    int getBaseProcessingTimeSec() const;
};
