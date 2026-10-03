#include "warehouse/WarehouseManager.hpp"

bool InventoryManager::reserveOrderInventory(std::shared_ptr<Warehouse> warehouse, 
                                             const std::vector<std::pair<std::string, int>>& items) {
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

    // Rollback if partial failure occurs
    if (!allReserved) {
        for (const auto& item : successfullyReserved) {
            warehouse->releaseStock(item.first, item.second);
        }
        return false;
    }

    return true;
}

void WarehouseManager::registerWarehouse(std::shared_ptr<Warehouse> wh) {
    std::lock_guard<std::mutex> lock(managerMutex);
    warehouses[wh->getId()] = wh;
}

std::shared_ptr<Warehouse> WarehouseManager::getWarehouseById(const std::string& id) const {
    std::lock_guard<std::mutex> lock(managerMutex);
    auto it = warehouses.find(id);
    return it != warehouses.end() ? it->second : nullptr;
}

std::vector<std::shared_ptr<Warehouse>> WarehouseManager::getAllWarehouses() const {
    std::lock_guard<std::mutex> lock(managerMutex);
    std::vector<std::shared_ptr<Warehouse>> list;
    list.reserve(warehouses.size());
    for (const auto& pair : warehouses) {
        list.push_back(pair.second);
    }
    return list;
}

WarehouseEvaluationResult WarehouseManager::selectOptimalWarehouse(
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
