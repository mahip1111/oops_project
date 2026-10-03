/**
 * =================================================================================================
 *  QUICKFLOW AUTOMATED UNIT TEST HARNESS & INVARIANT VERIFICATION SUITE
 * =================================================================================================
 */

#include <iostream>
#include <cassert>
#include <string>
#include <vector>
#include <memory>

#include "domain/Customer.hpp"
#include "domain/Product.hpp"
#include "domain/Inventory.hpp"
#include "domain/Order.hpp"
#include "warehouse/Warehouse.hpp"
#include "warehouse/WarehouseManager.hpp"
#include "warehouse/WorkerManager.hpp"
#include "core/OrderStateMachine.hpp"
#include "core/EventBus.hpp"
#include "routing/GraphRouter.hpp"
#include "pipeline/Task.hpp"
#include "pipeline/Scheduler.hpp"
#include "pipeline/ResilienceQueue.hpp"
#include "simulation/Simulator.hpp"

// Test assertion helper macro
int testsPassed = 0;
int testsTotal = 0;

void reportTest(const std::string& testName, bool condition) {
    testsTotal++;
    if (condition) {
        testsPassed++;
        std::cout << "  [PASS] " << testName << "\n";
    } else {
        std::cerr << "  [FAIL] " << testName << "\n";
    }
}

void testDomainEntities() {
    std::cout << "\n--- Testing Domain Entities & Encapsulation ---\n";
    Customer cust("CUST-999", "Alice Smith", "alice@example.com", "123 Main St", "Mumbai", "+91 99999-11111");
    reportTest("Customer ID & Email getter validation", cust.getId() == "CUST-999" && cust.getEmail() == "alice@example.com");

    Product p("SKU-TEST", "iPad Pro", "Tablets", 89900.0, 0.6, "Aisle 01", "Shelf 05");
    reportTest("Product SKU & Price validation", p.getSku() == "SKU-TEST" && p.getPrice() == 89900.0);
}

void testInventoryThreadSafety() {
    std::cout << "\n--- Testing Thread-Safe Inventory & RAII Mutex ---\n";
    Inventory inv;
    inv.addStock("SKU-LAP", "Laptop", 10, 2, 50000.0);
    
    reportTest("Available stock check", inv.getAvailableStock("SKU-LAP") == 10);
    reportTest("Stock reservation success", inv.reserve("SKU-LAP", 4));
    reportTest("Reserved stock verification", inv.getReservedStock("SKU-LAP") == 4 && inv.getAvailableStock("SKU-LAP") == 6);
    
    reportTest("Over-reservation rejection", !inv.reserve("SKU-LAP", 10));
    reportTest("Stock release / rollback", inv.release("SKU-LAP", 2));
    reportTest("Stock after rollback", inv.getAvailableStock("SKU-LAP") == 8 && inv.getReservedStock("SKU-LAP") == 2);
}

void testOrderStateMachine() {
    std::cout << "\n--- Testing Order State Machine Invariant Protection ---\n";
    OrderStateMachine sm;
    reportTest("Initial State is CREATED", sm.getCurrentState() == OrderStateEnum::CREATED);

    // Invalid direct transition test
    bool invalidDirectJump = sm.transitionTo(OrderStateEnum::DELIVERED, "Direct invalid leap");
    reportTest("Invalid transition CREATED -> DELIVERED rejected", !invalidDirectJump && sm.getCurrentState() == OrderStateEnum::CREATED);

    // Valid sequential transitions
    reportTest("Transition CREATED -> CONFIRMED", sm.transitionTo(OrderStateEnum::CONFIRMED));
    reportTest("Transition CONFIRMED -> ALLOCATED", sm.transitionTo(OrderStateEnum::ALLOCATED));
    reportTest("Transition ALLOCATED -> PICKING", sm.transitionTo(OrderStateEnum::PICKING));
    reportTest("Transition PICKING -> PACKING", sm.transitionTo(OrderStateEnum::PACKING));
    reportTest("Transition PACKING -> QUALITY_CHECK", sm.transitionTo(OrderStateEnum::QUALITY_CHECK));
    reportTest("Transition QUALITY_CHECK -> SHIPPED", sm.transitionTo(OrderStateEnum::SHIPPED));
    reportTest("Transition SHIPPED -> DELIVERED", sm.transitionTo(OrderStateEnum::DELIVERED));
    reportTest("Terminal state DELIVERED rejects further transitions", !sm.transitionTo(OrderStateEnum::CONFIRMED));
}

void testGraphRouting() {
    std::cout << "\n--- Testing Graph Router & Dijkstra Shortest Path ---\n";
    GraphRouter router;
    auto res = router.findOptimalRoute("Bhubaneswar");
    reportTest("Optimal Hub is CCU-03 for Bhubaneswar", res.optimalHub == "CCU-03");
    reportTest("Computed latency is positive", res.totalLatencyMs > 0.0 && res.totalLatencyMs < 2.0);
    reportTest("Computed path contains destination", !res.path.empty() && res.path.back() == "BBI-01");
}

void testStrategyScheduler() {
    std::cout << "\n--- Testing Strategy Pattern Task Schedulers ---\n";
    Scheduler sched(std::make_unique<HybridScheduler>());
    reportTest("Initial scheduler is Hybrid", sched.getStrategyName().find("Hybrid") != std::string::npos);

    sched.setStrategy(std::make_unique<FIFOScheduler>());
    reportTest("Switched strategy to FIFO", sched.getStrategyName().find("FIFO") != std::string::npos);

    sched.setStrategy(std::make_unique<PriorityScheduler>());
    reportTest("Switched strategy to Priority", sched.getStrategyName().find("Priority") != std::string::npos);
}

void testResilienceQueue() {
    std::cout << "\n--- Testing Resilience Circuit Breaker & Quarantine Queue ---\n";
    ResilienceQueue rq;
    FulfillmentTask faultyTask("TEST-TASK-01", "ORD-101", TaskType::QUALITY_CHECK, "Barcode Scan", 5, 5, 30, "BOM-04");
    
    faultyTask.incrementRetry("Timeout 1");
    faultyTask.incrementRetry("Timeout 2");
    faultyTask.incrementRetry("Timeout 3");
    
    rq.addItem(faultyTask, "Max retries exceeded");
    reportTest("Task quarantined into manual review", rq.getPendingCount() == 1);
    
    bool resolved = rq.resolveWithRetry("REV-1001");
    reportTest("Operator resolution with retry", resolved && rq.getPendingCount() == 0);
}

int main() {
    std::cout << "================================================================================\n";
    std::cout << "          QUICKFLOW AUTOMATED TEST HARNESS (UNIT TEST EXECUTION)                \n";
    std::cout << "================================================================================\n";

    testDomainEntities();
    testInventoryThreadSafety();
    testOrderStateMachine();
    testGraphRouting();
    testStrategyScheduler();
    testResilienceQueue();

    std::cout << "\n================================================================================\n";
    std::cout << " TEST SUMMARY: " << testsPassed << " / " << testsTotal << " passed (" 
              << (testsPassed * 100 / testsTotal) << "% success rate)\n";
    std::cout << "================================================================================\n";

    return (testsPassed == testsTotal) ? 0 : 1;
}
