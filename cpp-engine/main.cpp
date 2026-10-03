/**
 * =================================================================================================
 *  QUICKFLOW ENTERPRISE C++ HIGH-PERFORMANCE LOGISTICS & ROUTING ENGINE
 * 
 *  Copyright (c) 2026 Manavendra Gupta. All Rights Reserved.
 *  Licensed under the MIT License. (See LICENSE file in root directory)
 * 
 *  Top-level application orchestrator following the Neutralinojs framework design paradigm.
 *  Initializes system dependency injections and orchestrates the complete 9-stage fulfillment pipeline.
 * =================================================================================================
 */

#include <memory>
#include "demo/EngineDemo.hpp"

int main() {
    // Print Enterprise System Banner with Author Attribution
    EngineDemo::printBanner();

    // ---------------------------------------------------------------------------------------------
    // Core Managers & Domain Dependency Injection
    // ---------------------------------------------------------------------------------------------
    auto warehouseManager = std::make_shared<WarehouseManager>();
    auto workerManager = std::make_shared<WorkerManager>();
    auto notificationManager = std::make_shared<NotificationManager>();
    auto scheduler = std::make_shared<Scheduler>(std::make_unique<HybridScheduler>());
    auto processor = std::make_shared<OrderProcessor>(warehouseManager, workerManager, notificationManager, scheduler);

    // ---------------------------------------------------------------------------------------------
    // Execution Orchestration across Modular Architectural Stages
    // ---------------------------------------------------------------------------------------------
    // Stage 1: Verify thread-safe inventory & register SuperHub network
    EngineDemo::demonstrateDomainInventory(warehouseManager, workerManager, notificationManager);

    // Stage 2: Execute Dijkstra shortest-path route computation
    EngineDemo::demonstrateGraphRouting();

    // Stage 3: Instantiate customer entity, products, and order
    Customer customer("CUST-10482", "Devon Lane", "devon@quickflow.io", 
                      "Plot 412, Infocity Road, Patia", "Bhubaneswar", "+91 98765-43210");
    Product macbook("lap-mbp-14", "MacBook Pro 14\"", "Laptops", 149900.0, 1.6, "Aisle 04-B", "Shelf 12");
    Product magicMouse("ms-magic", "Magic Mouse", "Accessories", 7900.0, 0.2, "Aisle 02-C", "Shelf 08");
    Order order("QF-10482", customer.getName(), customer.getCity(), OrderPriority::EXPRESS, 158299.0, 60);

    EngineDemo::demonstrateCustomerOrderCreation(customer, macbook, magicMouse, order);

    // Stage 4: Orchestrate fulfillment scoring and warehouse assignment
    EngineDemo::demonstrateOrderOrchestration(processor, order);

    // Stage 5: Decompose into DAG tasks and dispatch worker waves
    EngineDemo::demonstrateTaskDAGDispatch(scheduler, order);

    // Stage 6: Verify State Machine transitions and quality control
    EngineDemo::demonstrateOrderStateMachine(order);

    // Stage 7: Multithreaded asynchronous fulfillment task execution
    EngineDemo::demonstrateThreadPoolConcurrency();

    // Stage 8: Fault-tolerance, retry limits, and quarantine handling
    EngineDemo::demonstrateResilienceQueue();

    // Stage 9: High-volume What-If simulation benchmark (50,000 orders)
    EngineDemo::demonstrateSimulationBenchmark();

    // System Success Footer
    EngineDemo::printFooter();

    return 0;
}
