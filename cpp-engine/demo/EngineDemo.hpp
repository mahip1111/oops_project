#pragma once
#include <string>
#include <memory>
#include "domain/Customer.hpp"
#include "domain/Product.hpp"
#include "domain/Order.hpp"
#include "domain/Inventory.hpp"
#include "warehouse/WarehouseManager.hpp"
#include "warehouse/WorkerManager.hpp"
#include "observer/NotificationManager.hpp"
#include "pipeline/Scheduler.hpp"
#include "routing/GraphRouter.hpp"
#include "pipeline/OrderProcessor.hpp"
#include "pipeline/ResilienceQueue.hpp"
#include "simulation/Simulator.hpp"
#include "core/ThreadPool.hpp"

/**
 * @class EngineDemo
 * @brief High-level Orchestrator encapsulating each architectural demonstration stage.
 * Keeps main.cpp clean, modular, and easy to read while maintaining enterprise-grade structure.
 */
class EngineDemo {
public:
    static void printBanner();
    static void printSectionHeader(int sectionNum, const std::string& title, const std::string& patternName);
    static void printFooter();

    // Architectural Stages
    static void demonstrateDomainInventory(std::shared_ptr<WarehouseManager> whMgr,
                                          std::shared_ptr<WorkerManager> wrkMgr,
                                          std::shared_ptr<NotificationManager> notifMgr);

    static void demonstrateGraphRouting();

    static void demonstrateCustomerOrderCreation(Customer& customer, 
                                                 Product& macbook, 
                                                 Product& magicMouse, 
                                                 Order& order);

    static void demonstrateOrderOrchestration(std::shared_ptr<OrderProcessor> processor, 
                                              Order& order);

    static void demonstrateTaskDAGDispatch(std::shared_ptr<Scheduler> scheduler, 
                                           Order& order);

    static void demonstrateOrderStateMachine(Order& order);

    static void demonstrateThreadPoolConcurrency();

    static void demonstrateResilienceQueue();

    static void demonstrateSimulationBenchmark();
};
