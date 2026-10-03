#include "warehouse/Warehouse.hpp"
#include <sstream>
#include <iomanip>
#include <algorithm>
#include <cmath>

Warehouse::Warehouse(std::string wId, std::string wName, std::string wCity, int cap, int currentOrders,
                     int procTimeSec, double shippingRate)
    : id(wId), name(wName), city(wCity), capacity(cap), activeOrders(currentOrders),
      baseProcessingTimeSec(procTimeSec), baseShippingRatePerKm(shippingRate),
      warehouseMutex(std::make_unique<std::mutex>()) {}

Warehouse::Warehouse(const Warehouse& other)
    : id(other.id), name(other.name), city(other.city), capacity(other.capacity),
      activeOrders(other.activeOrders), baseProcessingTimeSec(other.baseProcessingTimeSec),
      baseShippingRatePerKm(other.baseShippingRatePerKm), inventory(other.inventory),
      warehouseMutex(std::make_unique<std::mutex>()) {}

Warehouse::Warehouse(Warehouse&& other) noexcept
    : id(std::move(other.id)), name(std::move(other.name)), city(std::move(other.city)),
      capacity(other.capacity), activeOrders(other.activeOrders),
      baseProcessingTimeSec(other.baseProcessingTimeSec),
      baseShippingRatePerKm(other.baseShippingRatePerKm), inventory(std::move(other.inventory)),
      warehouseMutex(std::make_unique<std::mutex>()) {}

Warehouse& Warehouse::operator=(const Warehouse& other) {
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

void Warehouse::setStock(const std::string& sku, int qty) {
    std::lock_guard<std::mutex> lock(*warehouseMutex);
    inventory[sku] = qty;
}

int Warehouse::getStock(const std::string& sku) const {
    std::lock_guard<std::mutex> lock(*warehouseMutex);
    auto it = inventory.find(sku);
    return it != inventory.end() ? it->second : 0;
}

double Warehouse::getUtilization() const {
    std::lock_guard<std::mutex> lock(*warehouseMutex);
    if (capacity == 0) return 0.0;
    return (static_cast<double>(activeOrders) / capacity) * 100.0;
}

bool Warehouse::checkInventoryEligibility(const std::vector<std::pair<std::string, int>>& requiredItems, 
                                         std::string& outReason) const {
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

WarehouseEvaluationResult Warehouse::evaluateFulfillmentCost(
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

bool Warehouse::reserveStock(const std::string& sku, int quantity) {
    std::lock_guard<std::mutex> lock(*warehouseMutex);
    auto it = inventory.find(sku);
    if (it != inventory.end() && it->second >= quantity) {
        it->second -= quantity;
        activeOrders += quantity;
        return true;
    }
    return false;
}

void Warehouse::releaseStock(const std::string& sku, int quantity) {
    std::lock_guard<std::mutex> lock(*warehouseMutex);
    inventory[sku] += quantity;
    activeOrders = std::max(0, activeOrders - quantity);
}

std::string Warehouse::getId() const { return id; }
std::string Warehouse::getName() const { return name; }
std::string Warehouse::getCity() const { return city; }
int Warehouse::getCapacity() const { return capacity; }
int Warehouse::getActiveOrders() const { return activeOrders; }
int Warehouse::getBaseProcessingTimeSec() const { return baseProcessingTimeSec; }
