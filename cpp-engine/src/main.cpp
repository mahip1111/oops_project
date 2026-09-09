#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>
#include <cassert>
#include "../include/Customer.hpp"
#include "../include/Product.hpp"
#include "../include/Order.hpp"
#include "../include/Warehouse.hpp"
#include "../include/Inventory.hpp"
#include "../include/WarehouseManager.hpp"
#include "../include/WorkerManager.hpp"
#include "../include/NotificationManager.hpp"
#include "../include/OrderProcessor.hpp"
#include "../include/GraphRouter.hpp"
#include "../include/Task.hpp"
#include "../include/Scheduler.hpp"
#include "../include/ResilienceQueue.hpp"
#include "../include/Simulator.hpp"
#include "../include/ThreadPool.hpp"

int main() {
    std::cout << "================================================================================" << std::endl;
    std::cout << "   QUICKFLOW C++ FASTROUTE LOGISTICS ENGINE (TECHNICAL ARCHITECTURE PRD)        " << std::endl;
    std::cout << "================================================================================" << std::endl;

    // -------------------------------------------------------------------------
    // 1. DOMAIN MODEL INITIALIZATION (PRD Section 4: OOP Domain Structure)
    // -------------------------------------------------------------------------
    std::cout << "\n[1. DOMAIN ARCHITECTURE & INVENTORY INITIALIZATION (PRD Section 4)]" << std::endl;
    auto warehouseManager = std::make_shared<WarehouseManager>();
    auto workerManager = std::make_shared<WorkerManager>();
    auto notificationManager = std::make_shared<NotificationManager>();
    auto telemetryLogger = std::make_shared<TelemetryLoggerObserver>();
    notificationManager->attach(telemetryLogger);

    // Explicit Inventory Domain verification
    Inventory centralInventory;
    centralInventory.addStock("lap-mbp-14", "MacBook Pro 14\"", 100, 15, 149900.0);
    centralInventory.addStock("ms-magic", "Magic Mouse", 150, 20, 7900.0);
    assert(centralInventory.checkAvailability("lap-mbp-14", 1));
    bool reserved = centralInventory.reserve("lap-mbp-14", 1);
    assert(reserved);
    assert(centralInventory.getReservedStock("lap-mbp-14") == 1);
    centralInventory.release("lap-mbp-14", 1);
    std::cout << "  ✓ Inventory domain verified: thread-safe reservation & rollback active" << std::endl;

    // Register Multi-Warehouse SuperHub Network (PRD Section 4 Exact Mapping)
    auto delhi = std::make_shared<Warehouse>("DEL-01", "Delhi SuperHub", "Delhi", 50000, 2310, 28, 0.45);
    delhi->setStock("lap-mbp-14", 50);
    delhi->setStock("ms-magic", 80);

    auto mumbai = std::make_shared<Warehouse>("BOM-04", "Mumbai MegaPort", "Mumbai", 65000, 3840, 24, 0.40);
    mumbai->setStock("lap-mbp-14", 120);
    mumbai->setStock("ms-magic", 150);

    auto hyderabad = std::make_shared<Warehouse>("HYD-02", "Hyderabad Cyber Node", "Hyderabad", 40000, 1420, 22, 0.42);
    hyderabad->setStock("lap-mbp-14", 0); // Out of stock for laptop
    hyderabad->setStock("ms-magic", 200);

    auto kolkata = std::make_shared<Warehouse>("CCU-03", "Kolkata Gateway", "Kolkata", 35000, 2890, 32, 0.50);
    kolkata->setStock("lap-mbp-14", 40);
    kolkata->setStock("ms-magic", 0); // Out of stock for mouse

    warehouseManager->registerWarehouse(delhi);
    warehouseManager->registerWarehouse(mumbai);
    warehouseManager->registerWarehouse(hyderabad);
    warehouseManager->registerWarehouse(kolkata);

    std::cout << "  ✓ Registered " << warehouseManager->getAllWarehouses().size() << " SuperHubs in WarehouseManager (HashMap lookup)" << std::endl;
    std::cout << "  ✓ Registered " << workerManager->getAllWorkers().size() << " Multi-Department Workers & AGVs in WorkerManager" << std::endl;
    std::cout << "  ✓ Attached TelemetryLoggerObserver to NotificationManager (Observer Pattern)" << std::endl;

    // -------------------------------------------------------------------------
    // 2. GRAPH & DIJKSTRA ROUTE OPTIMIZATION (PRD Section 6: DSA Requirements)
    // -------------------------------------------------------------------------
    std::cout << "\n[2. GRAPH NETWORK & DIJKSTRA SHORTEST PATH ROUTING (PRD Section 6)]" << std::endl;
    GraphRouter router;
    RouteResult route = router.findOptimalRoute("Bhubaneswar");
    std::cout << "  ✓ Optimal Hub Selected: " << route.optimalHub << std::endl;
    std::cout << "  ✓ Shortest Path: ";
    for (size_t i = 0; i < route.path.size(); ++i) {
        std::cout << route.path[i] << (i + 1 < route.path.size() ? " -> " : "");
    }
    std::cout << " (Latency: " << route.totalLatencyMs << " ms)" << std::endl;

    // -------------------------------------------------------------------------
    // 3. ORDER CREATION WITH CUSTOMER & PRODUCT DOMAINS (PRD Section 4)
    // -------------------------------------------------------------------------
    std::cout << "\n[3. CUSTOMER ORDER JOURNEY (PRD SECTION 2 & 4)]" << std::endl;
    Customer customer("CUST-10482", "Devon Lane", "devon@quickflow.io", "Plot 412, Infocity Road, Patia", "Bhubaneswar", "+91 98765-43210");
    Product macbook("lap-mbp-14", "MacBook Pro 14\"", "Laptops", 149900.0, 1.6, "Aisle 04-B", "Shelf 12");
    Product magicMouse("ms-magic", "Magic Mouse", "Accessories", 7900.0, 0.2, "Aisle 02-C", "Shelf 08");

    Order order("QF-10482", customer.getName(), customer.getCity(), OrderPriority::EXPRESS, 158299.0, 60);
    order.addItem({macbook.getSku(), macbook.getName(), "Space Black", 1, macbook.getPrice(), macbook.getAisle(), macbook.getShelf(), true});
    order.addItem({magicMouse.getSku(), magicMouse.getName(), "White", 1, magicMouse.getPrice(), magicMouse.getAisle(), magicMouse.getShelf(), true});

    std::cout << "  Order #" << order.getId() << " created for Customer: " << customer.getName() 
              << " (" << customer.getEmail() << ")" << std::endl;
    std::cout << "  Delivery Destination: " << customer.getAddress() << ", " << customer.getCity() << std::endl;

    // -------------------------------------------------------------------------
    // 4. ORCHESTRATION VIA ORDERPROCESSOR & STRATEGY SCHEDULER (PRD Section 4 & 5)
    // -------------------------------------------------------------------------
    std::cout << "\n[4. END-TO-END ORCHESTRATION VIA ORDERPROCESSOR]" << std::endl;
    auto scheduler = std::make_shared<Scheduler>(std::make_unique<HybridScheduler>());
    auto processor = std::make_shared<OrderProcessor>(warehouseManager, workerManager, notificationManager, scheduler);

    std::unordered_map<std::string, double> distanceMap = {
        {"BOM-04", 1640.0},
        {"DEL-01", 1500.0},
        {"HYD-02", 1050.0},
        {"CCU-03", 440.0}
    };

    bool processed = processor->processOrder(order, distanceMap);
    assert(processed);
    std::cout << "  >> Order #" << order.getId() << " successfully processed. Assigned Hub: " << order.getAssignedHub() << std::endl;

    // -------------------------------------------------------------------------
    // 5. FACTORY PATTERN TASK VERIFICATION & DISPATCH (PRD Section 5 & 8)
    // -------------------------------------------------------------------------
    std::cout << "\n[5. FACTORY PATTERN TASKS & WORKER DISPATCH]" << std::endl;
    for (const auto& task : order.getTasks()) {
        std::cout << "  • Task [" << task.getTaskId() << "] " << std::left << std::setw(15) << task.getTypeName()
                  << " | " << std::left << std::setw(42) << task.getTaskName()
                  << " | Status: " << std::left << std::setw(22) << task.getStatusName() << std::endl;
    }

    auto wave1 = scheduler->dispatchNextBatch();
    std::cout << "\n  Dispatched Wave 1 (Independent Parallel Picks):" << std::endl;
    for (const auto& pair : wave1) {
        std::cout << "    >> Assigned Task [" << pair.first.getTaskId() << "] to Worker [" 
                  << pair.second.name << " (" << pair.second.role << ")]" << std::endl;
    }

    // Complete picks
    scheduler->completeTask(order.getId() + "-PICK-1");
    scheduler->completeTask(order.getId() + "-PICK-2");

    // Dispatch Pack
    auto wave2 = scheduler->dispatchNextBatch();
    std::cout << "\n  Dispatched Wave 2 (Unlocked Packing Stage):" << std::endl;
    for (const auto& pair : wave2) {
        std::cout << "    >> Assigned Task [" << pair.first.getTaskId() << "] to Worker [" 
                  << pair.second.name << " (" << pair.second.role << ")]" << std::endl;
    }

    // -------------------------------------------------------------------------
    // 6. QUALITY CHECK, REPROCESSING & FINAL MILE (PRD Section 14 & 15)
    // -------------------------------------------------------------------------
    std::cout << "\n[6. QUALITY CHECK & STATE MACHINE COMPLETION]" << std::endl;
    order.advanceState(OrderStateEnum::PACKING, "Packing completed in Apple thermal carton");
    order.advanceState(OrderStateEnum::QUALITY_CHECK, "Laser barcode & RFID seal scan");
    order.handleQCResult(true, "All barcode RFID tags & serial seals 100% verified");
    order.advanceState(OrderStateEnum::DELIVERED, "Delivered to Devon Lane with OTP verification");

    std::cout << "  ✓ Order State Machine Final State: " << order.getCurrentStateString() << std::endl;

    // -------------------------------------------------------------------------
    // 7. THREAD POOL PARALLEL EXECUTION (PRD Section 8 & 12)
    // -------------------------------------------------------------------------
    std::cout << "\n[7. CONCURRENCY THREADPOOL PARALLEL EXECUTION (PRD SECTION 8 & 12)]" << std::endl;
    {
        ThreadPool pool(4);
        std::vector<std::future<std::string>> futures;

        for (int i = 1; i <= 4; ++i) {
            futures.emplace_back(pool.enqueue([i] {
                std::this_thread::sleep_for(std::chrono::milliseconds(15));
                return "Worker Thread #" + std::to_string(i) + " processed synchronized queue segment.";
            }));
        }

        for (auto& f : futures) {
            std::cout << "    • " << f.get() << std::endl;
        }
    }

    // -------------------------------------------------------------------------
    // 8. WHAT-IF SIMULATION ENGINE (PRD Section 9: /api/simulation)
    // -------------------------------------------------------------------------
    std::cout << "\n[8. WHAT-IF SIMULATION ENGINE (50,000 ORDERS BENCHMARK)]" << std::endl;
    SimulationConfig config;
    config.orderCount = 50000;
    config.workerCount = 40;
    config.activeHubs = {"BOM-04", "DEL-01", "HYD-02", "CCU-03"};
    config.strategy = "Hybrid";
    config.expressOrderPct = 30.0;

    auto simResult = Simulator::run(config);
    std::cout << "  ✓ Strategy: " << simResult.strategyName << std::endl;
    std::cout << "  ✓ SLA Adherence: " << simResult.slaAdherencePct << " % | Throughput: " 
              << simResult.throughputPerHour << " orders/hr" << std::endl;
    std::cout << "  ✓ Estimated Completion Time: " << simResult.estimatedCompletionHours << " hrs" << std::endl;
    std::cout << "  ✓ Late Orders: " << simResult.lateOrdersCount << " / 50000" << std::endl;
    std::cout << "  ✓ Recommendation: " << simResult.recommendation << std::endl;

    std::cout << "\n================================================================================" << std::endl;
    std::cout << "   [OK] ALL TECHNICAL ARCHITECTURE PRD MODULES FULLY COMPILED & EXECUTED        " << std::endl;
    std::cout << "================================================================================" << std::endl;

    return 0;
}
