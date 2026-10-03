#include "domain/Order.hpp"

Order::Order(std::string orderId, std::string customer, std::string destCity, 
             OrderPriority prio, double total, int deadlineMins)
    : id(orderId), customerName(customer), destinationCity(destCity), priority(prio),
      totalAmount(total), deadlineMinutes(deadlineMins), 
      createdAt(std::chrono::system_clock::now()), isUnderManualReview(false) {}

void Order::addItem(const OrderItem& item) {
    items.push_back(item);
}

bool Order::advanceState(OrderStateEnum targetState, const std::string& reason) {
    return stateMachine.transitionTo(targetState, reason);
}

OrderStateEnum Order::getCurrentState() const {
    return stateMachine.getCurrentState();
}

std::string Order::getCurrentStateString() const {
    return stateMachine.getCurrentStateString();
}

void Order::generateFulfillmentTasks(const std::string& hub) {
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
    tasks.emplace_back(packTaskId, id, TaskType::PACK_ORDER, "Tamper-Proof Apple Packaging & Cushioning", 
                       10, prioVal, deadlineMinutes, hub, "All Items", pickTaskIds);

    // Stage 3: Quality Check (Depends on Pack task)
    std::string qcTaskId = id + "-QC";
    tasks.emplace_back(qcTaskId, id, TaskType::QUALITY_CHECK, "Laser Barcode, Serial & Damage Verification", 
                       8, prioVal + 1, deadlineMinutes, hub, "All Items", std::vector<std::string>{packTaskId});

    // Stage 4: Ship Order (Depends on QC task)
    std::string shipTaskId = id + "-SHIP";
    tasks.emplace_back(shipTaskId, id, TaskType::SHIP_ORDER, "Hyperlocal Air Courier Dispatch & Handover", 
                       6, prioVal + 2, deadlineMinutes, hub, "All Items", std::vector<std::string>{qcTaskId});
}

bool Order::handleQCResult(bool passed, const std::string& notes) {
    if (passed) {
        advanceState(OrderStateEnum::SHIPPED, "Quality Check Passed: " + notes);
        return true;
    } else {
        advanceState(OrderStateEnum::REPROCESSING, "Quality Check Failed: " + notes + ". Order quarantined for reprocessing.");
        return false;
    }
}

std::string Order::getId() const { return id; }
std::string Order::getCustomerName() const { return customerName; }
std::string Order::getDestinationCity() const { return destinationCity; }
OrderPriority Order::getPriority() const { return priority; }
std::string Order::getAssignedHub() const { return assignedHub; }
void Order::setAssignedHub(const std::string& hub) { assignedHub = hub; }
const std::vector<OrderItem>& Order::getItems() const { return items; }
double Order::getTotal() const { return totalAmount; }
int Order::getDeadlineMinutes() const { return deadlineMinutes; }
std::vector<FulfillmentTask>& Order::getTasks() { return tasks; }
const std::vector<FulfillmentTask>& Order::getTasks() const { return tasks; }
void Order::setEvaluationResult(const WarehouseEvaluationResult& eval) { evaluationResult = eval; }
const WarehouseEvaluationResult& Order::getEvaluationResult() const { return evaluationResult; }
bool Order::isManualReview() const { return isUnderManualReview; }
void Order::setManualReview(bool review) { isUnderManualReview = review; }
