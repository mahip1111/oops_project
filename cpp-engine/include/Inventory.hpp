#pragma once
#include <string>
#include <unordered_map>
#include <mutex>
#include <memory>
#include <vector>
#include <sstream>

struct InventoryItem {
    std::string sku;
    std::string productName;
    int quantityAvailable;
    int quantityReserved;
    int reorderThreshold;
    double unitPrice;
};

// Inventory Domain Model (PRD Section 4)
class Inventory {
private:
    std::unordered_map<std::string, InventoryItem> items; // SKU -> InventoryItem
    mutable std::mutex inventoryMutex;

public:
    Inventory() = default;

    void addStock(const std::string& sku, const std::string& name, int qty, int reorderLevel = 10, double price = 0.0) {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        if (items.find(sku) != items.end()) {
            items[sku].quantityAvailable += qty;
        } else {
            items[sku] = {sku, name, qty, 0, reorderLevel, price};
        }
    }

    int getAvailableStock(const std::string& sku) const {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        return it != items.end() ? it->second.quantityAvailable : 0;
    }

    int getReservedStock(const std::string& sku) const {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        return it != items.end() ? it->second.quantityReserved : 0;
    }

    bool checkAvailability(const std::string& sku, int qty) const {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        return it != items.end() && it->second.quantityAvailable >= qty;
    }

    bool reserve(const std::string& sku, int qty) {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        if (it == items.end() || it->second.quantityAvailable < qty) {
            return false;
        }
        it->second.quantityAvailable -= qty;
        it->second.quantityReserved += qty;
        return true;
    }

    bool release(const std::string& sku, int qty) {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        if (it == items.end() || it->second.quantityReserved < qty) {
            return false;
        }
        it->second.quantityReserved -= qty;
        it->second.quantityAvailable += qty;
        return true;
    }

    bool commit(const std::string& sku, int qty) {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        auto it = items.find(sku);
        if (it == items.end() || it->second.quantityReserved < qty) {
            return false;
        }
        it->second.quantityReserved -= qty;
        return true;
    }

    std::vector<InventoryItem> getAllStock() const {
        std::lock_guard<std::mutex> lock(inventoryMutex);
        std::vector<InventoryItem> list;
        for (const auto& [sku, item] : items) {
            list.push_back(item);
        }
        return list;
    }
};
