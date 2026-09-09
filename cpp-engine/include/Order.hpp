#pragma once
#include <string>
#include <vector>
#include <chrono>
#include <sstream>
#include "Task.hpp"
#include "Warehouse.hpp"
#include "OrderStateMachine.hpp"

enum class OrderPriority {
    STANDARD = 3,
    EXPRESS = 6,
    SAME_DAY = 9
};

struct OrderItem {
    std::string id;
    std::string name;
    std::string color;
    int quantity;
    double price;
    std::string aisle;
    std::string shelf;
    bool located;
};

class Order {
private:
    std::string id;
    std::string customerName;
    std::string destinationCity;
    std::string deliveryAddress;
    OrderPriority priority;
    OrderStateMachine stateMachine;
    std::string assignedHub;
    std::vector<OrderItem> items;
    double totalAmount;
    int deadlineMinutes;
    std::chrono::system_clock::time_point createdAt;
    std::vector<FulfillmentTask> tasks;
    WarehouseEvaluationResult evaluationResult;
    bool isUnderManualReview;

public:
    Order(std::string orderId, std::string customer, std::string destCity, OrderPriority prio, double total, int deadlineMins = 120)
        : id(orderId), customerName(customer), destinationCity(destCity), priority(prio),
          totalAmount(total), deadlineMinutes(deadlineMins), createdAt(std::chrono::system_clock::now()), isUnderManualReview(false) {}

    void addItem(const OrderItem& item) {
        items.push_back(item);
    }

    // State Machine Transitions (PRD Section 14)
    bool advanceState(OrderStateEnum targetState, const std::string& reason = "") {
        return stateMachine.transitionTo(targetState, reason);
    }

    OrderStateEnum getCurrentState() const {
        return stateMachine.getCurrentState();
    }

    std::string getCurrentStateString() const {
        return stateMachine.getCurrentStateString();
    }

    // PRD Section 7 & 8: Decompose into independent Pick tasks + Dependent Downstream stages
    // Sequence: PICK items (independent) -> PACK -> QUALITY CHECK -> SHIP
    void generateFulfillmentTasks(const std::string& hub) {
        tasks.clear();
        assignedHub = hub;
        int prioVal = static_cast<int>(priority);

        std::vector<std::string> pickTaskIds;

        // Stage 1: Parallel Picking tasks for each item
        for (size_t i = 0; i < items.size(); ++i) {
            std::string tId = id + "-PICK-" + std::to_string(i + 1);
            pickTaskIds.push_back(tId);
            std::string name = "Pick " + items[i].name + " from " + items[i].aisle + " / " + items[i].shelf;
            tasks.emplace_back(tId, id, TaskType::PICK_ITEM, name, 12, prioVal, deadlineMinutes, hub, items[i].name, std::vector<std::string>{});
        }

        // Stage 2: Pack Order (Depends on all Picking tasks)
        std::string packTaskId = id + "-PACK";
        tasks.emplace_back(packTaskId, id, TaskType::PACK_ORDER, "Tamper-Proof Apple Packaging & Cushioning", 10, prioVal, deadlineMinutes, hub, "All Items", pickTaskIds);

        // Stage 3: Quality Check (Depends on Pack task)
        std::string qcTaskId = id + "-QC";
        tasks.emplace_back(qcTaskId, id, TaskType::QUALITY_CHECK, "Laser Barcode, Serial & Damage Verification", 8, prioVal + 1, deadlineMinutes, hub, "All Items", std::vector<std::string>{packTaskId});

        // Stage 4: Ship Order (Depends on QC task)
        std::string shipTaskId = id + "-SHIP";
        tasks.emplace_back(shipTaskId, id, TaskType::SHIP_ORDER, "Hyperlocal Air Courier Dispatch & Handover", 6, prioVal + 2, deadlineMinutes, hub, "All Items", std::vector<std::string>{qcTaskId});
    }

    // PRD Section 15: Quality Check Result Handler
    bool handleQCResult(bool passed, const std::string& notes = "") {
        if (passed) {
            advanceState(OrderStateEnum::SHIPPED, "Quality Check Passed: " + notes);
            return true;
        } else {
            // Failed QC sends order for reprocessing rather than shipping (PRD Section 15)
            advanceState(OrderStateEnum::REPROCESSING, "Quality Check Failed: " + notes + ". Order quarantined for reprocessing.");
            return false;
        }
    }

    std::string getId() const { return id; }
    std::string getCustomerName() const { return customerName; }
    std::string getDestinationCity() const { return destinationCity; }
    OrderPriority getPriority() const { return priority; }
    std::string getAssignedHub() const { return assignedHub; }
    void setAssignedHub(const std::string& hub) { assignedHub = hub; }
    const std::vector<OrderItem>& getItems() const { return items; }
    double getTotal() const { return totalAmount; }
    int getDeadlineMinutes() const { return deadlineMinutes; }
    std::vector<FulfillmentTask>& getTasks() { return tasks; }
    const std::vector<FulfillmentTask>& getTasks() const { return tasks; }
    void setEvaluationResult(const WarehouseEvaluationResult& eval) { evaluationResult = eval; }
    const WarehouseEvaluationResult& getEvaluationResult() const { return evaluationResult; }
    bool isManualReview() const { return isUnderManualReview; }
    void setManualReview(bool review) { isUnderManualReview = review; }
};
