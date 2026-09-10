#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "Compat.hpp"
#include "Warehouse.hpp"

// Inventory Manager Domain (PRD Section 4)
class InventoryManager {
public:
    static bool reserveOrderInventory(std::shared_ptr<Warehouse> warehouse, const std::vector<std::pair<std::string, int>>& items) {
        if (!warehouse) return false;
        bool allReserved = true;
        std::vector<std::pair<std::string, int>> successfullyReserved;

        for (const auto& item : items) {
            if (warehouse->reserveStock(item.first, item.second)) {
                successfullyReserved.push_back(item);
            } else {
                allReserved = false;
                break;
            }
        }

        // Rollback if partial failure
        if (!allReserved) {
            for (const auto& item : successfullyReserved) {
                warehouse->releaseStock(item.first, item.second);
            }
            return false;
        }

        return true;
    }
};

// Warehouse Manager Domain (PRD Section 4)
class WarehouseManager {
private:
    std::unordered_map<std::string, std::shared_ptr<Warehouse>> warehouses; // HashMap lookup (PRD Section 6)
    mutable std::mutex managerMutex;

public:
    void registerWarehouse(std::shared_ptr<Warehouse> wh) {
        std::lock_guard<std::mutex> lock(managerMutex);
        warehouses[wh->getId()] = wh;
    }

    std::shared_ptr<Warehouse> getWarehouseById(const std::string& id) const {
        std::lock_guard<std::mutex> lock(managerMutex);
        auto it = warehouses.find(id);
        return it != warehouses.end() ? it->second : nullptr;
    }

    std::vector<std::shared_ptr<Warehouse>> getAllWarehouses() const {
        std::lock_guard<std::mutex> lock(managerMutex);
        std::vector<std::shared_ptr<Warehouse>> list;
        for (const auto& pair : warehouses) {
            list.push_back(pair.second);
        }
        return list;
    }

    // Evaluates all registered warehouses and returns the winning lowest-cost candidate
    WarehouseEvaluationResult selectOptimalWarehouse(
        const std::vector<std::pair<std::string, int>>& items,
        const std::unordered_map<std::string, double>& distanceMap) const {
        
        std::lock_guard<std::mutex> lock(managerMutex);
        WarehouseEvaluationResult bestResult;
        bestResult.totalCostScore = 999999.0;
        bestResult.isEligible = false;

        for (const auto& pair : warehouses) {
            const std::string& id = pair.first;
            const auto& wh = pair.second;
            double dist = distanceMap.find(id) != distanceMap.end() ? distanceMap.at(id) : 1200.0;
            auto eval = wh->evaluateFulfillmentCost(items, dist);

            if (eval.isEligible && eval.totalCostScore < bestResult.totalCostScore) {
                bestResult = eval;
            }
        }

        return bestResult;
    }
};
