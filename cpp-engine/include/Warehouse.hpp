#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include "Compat.hpp"
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <memory>
#include <cmath>

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
              int procTimeSec = 24, double shippingRate = 0.45)
        : id(wId), name(wName), city(wCity), capacity(cap), activeOrders(currentOrders),
          baseProcessingTimeSec(procTimeSec), baseShippingRatePerKm(shippingRate),
          warehouseMutex(std::make_unique<std::mutex>()) {}

    Warehouse(const Warehouse& other)
        : id(other.id), name(other.name), city(other.city), capacity(other.capacity),
          activeOrders(other.activeOrders), baseProcessingTimeSec(other.baseProcessingTimeSec),
          baseShippingRatePerKm(other.baseShippingRatePerKm), inventory(other.inventory),
          warehouseMutex(std::make_unique<std::mutex>()) {}

    Warehouse(Warehouse&& other) noexcept
        : id(std::move(other.id)), name(std::move(other.name)), city(std::move(other.city)),
          capacity(other.capacity), activeOrders(other.activeOrders),
          baseProcessingTimeSec(other.baseProcessingTimeSec),
          baseShippingRatePerKm(other.baseShippingRatePerKm), inventory(std::move(other.inventory)),
          warehouseMutex(std::make_unique<std::mutex>()) {}

    Warehouse& operator=(const Warehouse& other) {
        if (this != &other) {
            id = other.id;
            name = other.name;
            city = other.city;
            capacity = other.capacity;
            activeOrders = other.activeOrders;
            baseProcessingTimeSec = other.baseProcessingTimeSec;
            baseShippingRatePerKm = other.baseShippingRatePerKm;
            inventory = other.inventory;
            warehouseMutex = std::make_unique<std::mutex>();
        }
        return *this;
    }

    void setStock(const std::string& sku, int qty) {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        inventory[sku] = qty;
    }

    int getStock(const std::string& sku) const {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        auto it = inventory.find(sku);
        return it != inventory.end() ? it->second : 0;
    }

    double getUtilization() const {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        if (capacity == 0) return 0.0;
        return (static_cast<double>(activeOrders) / capacity) * 100.0;
    }

    bool checkInventoryEligibility(const std::vector<std::pair<std::string, int>>& requiredItems, std::string& outReason) const {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        for (const auto& item : requiredItems) {
            const std::string& sku = item.first;
            int qty = item.second;
            auto it = inventory.find(sku);
            if (it == inventory.end() || it->second < qty) {
                int available = (it != inventory.end() ? it->second : 0);
                std::stringstream ss;
                ss << "Out of stock for SKU '" << sku << "' (Required: " << qty << ", Available: " << available << ")";
                outReason = ss.str();
                return false;
            }
        }
        outReason = "All SKUs in stock";
        return true;
    }

    WarehouseEvaluationResult evaluateFulfillmentCost(
        const std::vector<std::pair<std::string, int>>& requiredItems, double distanceKm) const {
        
        std::string ineligibilityReason;
        bool isEligible = checkInventoryEligibility(requiredItems, ineligibilityReason);

        if (!isEligible) {
            return {
                id, name, false, ineligibilityReason, distanceKm,
                9999.0, 9999.0, 9999.0, 9999.0, 99999.0,
                name + " (" + id + ") is INELIGIBLE: " + ineligibilityReason
            };
        }

        std::lock_guard<std::mutex> lock(*warehouseMutex);
        double util = capacity > 0 ? (static_cast<double>(activeOrders) / capacity) * 100.0 : 0.0;

        double distanceCost = distanceKm * 0.05;
        double workloadCost = (util * 0.40) + (util > 80.0 ? (util - 80.0) * 1.5 : 0.0);
        double processingCost = baseProcessingTimeSec * 0.8;
        double shippingCost = (distanceKm * baseShippingRatePerKm * 0.1) + 40.0;
        double totalCostScore = distanceCost + workloadCost + processingCost + shippingCost;

        std::stringstream ss;
        ss << name << " (" << id << ") Cost Score: " << std::fixed << std::setprecision(1) << totalCostScore
           << " [Distance: " << static_cast<int>(distanceKm) << "km (" << distanceCost << " pts), "
           << "Workload: " << std::setprecision(1) << util << "% (" << workloadCost << " pts), "
           << "Proc Time: " << baseProcessingTimeSec << "s (" << processingCost << " pts), "
           << "Shipping: ₹" << std::setprecision(0) << shippingCost << "]";

        return {
            id, name, true, "Eligible", distanceKm,
            distanceCost, workloadCost, processingCost, shippingCost,
            std::round(totalCostScore * 10.0) / 10.0,
            ss.str()
        };
    }

    bool reserveStock(const std::string& sku, int quantity) {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        auto it = inventory.find(sku);
        if (it != inventory.end() && it->second >= quantity) {
            it->second -= quantity;
            activeOrders += quantity;
            return true;
        }
        return false;
    }

    void releaseStock(const std::string& sku, int quantity) {
        std::lock_guard<std::mutex> lock(*warehouseMutex);
        inventory[sku] += quantity;
        activeOrders = std::max(0, activeOrders - quantity);
    }

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getCity() const { return city; }
    int getCapacity() const { return capacity; }
    int getActiveOrders() const { return activeOrders; }
    int getBaseProcessingTimeSec() const { return baseProcessingTimeSec; }
};
