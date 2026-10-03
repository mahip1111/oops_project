#pragma once
#include <string>
#include <vector>
#include <memory>
#include <unordered_map>
#include "domain/Order.hpp"
#include "warehouse/WarehouseManager.hpp"
#include "warehouse/WorkerManager.hpp"
#include "observer/NotificationManager.hpp"
#include "pipeline/Scheduler.hpp"

/**
 * @class OrderProcessor
 * @brief Top-level Domain Orchestrator coordinating inventory, warehouse scoring, task DAG generation, and notifications.
 */
class OrderProcessor {
private:
    std::shared_ptr<WarehouseManager> warehouseManager;
    std::shared_ptr<WorkerManager> workerManager;
    std::shared_ptr<NotificationManager> notificationManager;
    std::shared_ptr<Scheduler> scheduler;

public:
    OrderProcessor(
        std::shared_ptr<WarehouseManager> whMgr,
        std::shared_ptr<WorkerManager> wrkMgr,
        std::shared_ptr<NotificationManager> notifMgr,
        std::shared_ptr<Scheduler> sched);

    // End-to-End Order Processing Flow
    bool processOrder(Order& order, const std::unordered_map<std::string, double>& distanceMap);
};
