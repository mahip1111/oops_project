#include "domain/Inventory.hpp"

void Inventory::addStock(const std::string& sku, const std::string& name, int qty, int reorderLevel, double price) {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    if (it != items.end()) {
        it->second.quantityAvailable += qty;
    } else {
        items[sku] = InventoryItem{sku, name, qty, 0, reorderLevel, price};
    }
}

int Inventory::getAvailableStock(const std::string& sku) const {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    return it != items.end() ? it->second.quantityAvailable : 0;
}

int Inventory::getReservedStock(const std::string& sku) const {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    return it != items.end() ? it->second.quantityReserved : 0;
}

bool Inventory::checkAvailability(const std::string& sku, int qty) const {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    return it != items.end() && it->second.quantityAvailable >= qty;
}

bool Inventory::reserve(const std::string& sku, int qty) {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    if (it == items.end() || it->second.quantityAvailable < qty) {
        return false;
    }
    it->second.quantityAvailable -= qty;
    it->second.quantityReserved += qty;
    return true;
}

bool Inventory::release(const std::string& sku, int qty) {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    if (it == items.end() || it->second.quantityReserved < qty) {
        return false;
    }
    it->second.quantityReserved -= qty;
    it->second.quantityAvailable += qty;
    return true;
}

bool Inventory::commit(const std::string& sku, int qty) {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    auto it = items.find(sku);
    if (it == items.end() || it->second.quantityReserved < qty) {
        return false;
    }
    it->second.quantityReserved -= qty;
    return true;
}

std::vector<InventoryItem> Inventory::getAllStock() const {
    std::lock_guard<std::mutex> lock(inventoryMutex);
    std::vector<InventoryItem> list;
    list.reserve(items.size());
    for (const auto& pair : items) {
        list.push_back(pair.second);
    }
    return list;
}
