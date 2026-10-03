#include "pipeline/OrderProcessor.hpp"
#include <iostream>

OrderProcessor::OrderProcessor(
    std::shared_ptr<WarehouseManager> whMgr,
    std::shared_ptr<WorkerManager> wrkMgr,
    std::shared_ptr<NotificationManager> notifMgr,
    std::shared_ptr<Scheduler> sched)
    : warehouseManager(whMgr), workerManager(wrkMgr), notificationManager(notifMgr), scheduler(sched) {}

bool OrderProcessor::processOrder(Order& order, const std::unordered_map<std::string, double>& distanceMap) {
    // 1. Confirm Order
    order.advanceState(OrderStateEnum::CONFIRMED, "Order confirmed & payment token validated");
    notificationManager->notify(order.getId(), OrderEventNotificationType::ORDER_CREATED, "Order confirmed by customer", "API-GATEWAY");

    // 2. Select Optimal Warehouse
    std::vector<std::pair<std::string, int>> requiredItems;
    for (const auto& item : order.getItems()) {
        requiredItems.push_back({item.id, item.quantity});
    }

    auto eval = warehouseManager->selectOptimalWarehouse(requiredItems, distanceMap);
    if (!eval.isEligible) {
        std::cerr << "[PROCESS ERROR] No eligible warehouse found with stock for order " << order.getId() << std::endl;
        return false;
    }

    order.setAssignedHub(eval.hubId);
    order.setEvaluationResult(eval);
    order.advanceState(OrderStateEnum::ALLOCATED, "Allocated to " + eval.hubName + " via Lowest Cost Score (" + std::to_string(eval.totalCostScore) + " pts)");
    notificationManager->notify(order.getId(), OrderEventNotificationType::STOCK_ALLOCATED, "Allocated to " + eval.hubName, eval.hubId);

    // 3. Atomically Reserve Inventory
    auto wh = warehouseManager->getWarehouseById(eval.hubId);
    if (!InventoryManager::reserveOrderInventory(wh, requiredItems)) {
        std::cerr << "[PROCESS ERROR] Atomic stock reservation failed for order " << order.getId() << std::endl;
        return false;
    }

    // 4. Generate & Decompose Tasks
    order.generateFulfillmentTasks(eval.hubId);
    scheduler->enqueueTasks(order.getTasks());

    // 5. Advance to Picking State
    order.advanceState(OrderStateEnum::PICKING, "Parallel item picking wave initialized");
    notificationManager->notify(order.getId(), OrderEventNotificationType::STAGE_CHANGED, "Picking items in aisles", eval.hubId);

    return true;
}
