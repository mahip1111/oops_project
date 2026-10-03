#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <utility>
#include "core/Compat.hpp"
#include "warehouse/Warehouse.hpp"

/**
 * @class InventoryManager
 * @brief Handles multi-item atomic reservations with rollback capabilities across warehouses.
 */
class InventoryManager {
public:
    static bool reserveOrderInventory(std::shared_ptr<Warehouse> warehouse, 
                                      const std::vector<std::pair<std::string, int>>& items);
};

/**
 * @class WarehouseManager
 * @brief Registry and fulfillment evaluator for all regional SuperHubs (O(1) hash map lookup).
 */
class WarehouseManager {
private:
    std::unordered_map<std::string, std::shared_ptr<Warehouse>> warehouses;
    mutable std::mutex managerMutex;

public:
    WarehouseManager() = default;

    void registerWarehouse(std::shared_ptr<Warehouse> wh);
    std::shared_ptr<Warehouse> getWarehouseById(const std::string& id) const;
    std::vector<std::shared_ptr<Warehouse>> getAllWarehouses() const;

    WarehouseEvaluationResult selectOptimalWarehouse(
        const std::vector<std::pair<std::string, int>>& items,
        const std::unordered_map<std::string, double>& distanceMap) const;
};
