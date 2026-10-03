#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include <memory>
#include "core/Compat.hpp"

/**
 * @struct InventoryItem
 * @brief SKU level stock metadata record.
 */
struct InventoryItem {
    std::string sku;
    std::string productName;
    int quantityAvailable;
    int quantityReserved;
    int reorderThreshold;
    double unitPrice;
};

/**
 * @class Inventory
 * @brief Thread-Safe Central Inventory Domain Model (RAII Mutex Concurrency).
 * Prevents overselling & race conditions through atomic reservation and rollback mechanisms.
 */
class Inventory {
private:
    std::unordered_map<std::string, InventoryItem> items; // SKU -> InventoryItem
    mutable std::mutex inventoryMutex;

public:
    Inventory() = default;

    void addStock(const std::string& sku, const std::string& name, int qty, int reorderLevel = 10, double price = 0.0);
    int getAvailableStock(const std::string& sku) const;
    int getReservedStock(const std::string& sku) const;
    bool checkAvailability(const std::string& sku, int qty) const;
    bool reserve(const std::string& sku, int qty);
    bool release(const std::string& sku, int qty);
    bool commit(const std::string& sku, int qty);
    std::vector<InventoryItem> getAllStock() const;
};
