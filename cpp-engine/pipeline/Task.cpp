#include "pipeline/Task.hpp"
#include <algorithm>

// Base Task Implementation
Task::Task(std::string tId, std::string oId, TaskType tType, std::string name, int duration,
           int prio, int deadlineMins, std::string hub, std::string detailStr,
           std::vector<std::string> deps)
    : taskId(tId), orderId(oId), type(tType), taskName(name), estimatedDurationSec(duration),
      basePriority(prio), dynamicPriority(prio), deadlineMinutes(deadlineMins),
      status(deps.empty() ? TaskStatus::PENDING : TaskStatus::BLOCKED_BY_DEPENDENCY),
      retryCount(0), maxRetries(3), assignedWorkerId("UNASSIGNED"), assignedHub(hub),
      failureReason(""), details(detailStr), dependencyTaskIds(deps) {
    eventHistory.push_back("Task created in state: " + getStatusName());
}

std::string Task::getTypeName() const {
    switch (type) {
        case TaskType::PICK_ITEM: return "Picking Task";
        case TaskType::PACK_ORDER: return "Packing Task";
        case TaskType::QUALITY_CHECK: return "Quality Check Task";
        case TaskType::SHIP_ORDER: return "Shipping Task";
        default: return "Generic Task";
    }
}

std::string Task::getExecutionInstructions() const {
    return details.empty() ? "Execute assigned fulfillment task operation." : details;
}

std::string Task::getStatusName() const {
    switch (status) {
        case TaskStatus::PENDING: return "Pending";
        case TaskStatus::BLOCKED_BY_DEPENDENCY: return "Blocked by Dependency";
        case TaskStatus::ASSIGNED: return "Assigned";
        case TaskStatus::IN_PROGRESS: return "In Progress";
        case TaskStatus::COMPLETED: return "Completed";
        case TaskStatus::FAILED: return "Failed";
        case TaskStatus::MANUAL_REVIEW: return "Manual Review";
        default: return "Unknown";
    }
}

void Task::updateDynamicPriority(int remainingMinutes) {
    deadlineMinutes = remainingMinutes;
    if (remainingMinutes <= 15) {
        dynamicPriority = std::min(10, basePriority + 4);
    } else if (remainingMinutes <= 30) {
        dynamicPriority = std::min(10, basePriority + 2);
    } else {
        dynamicPriority = basePriority;
    }
}

void Task::addHistory(const std::string& entry) {
    eventHistory.push_back(entry);
}

std::string Task::getTaskId() const { return taskId; }
std::string Task::getOrderId() const { return orderId; }
TaskType Task::getType() const { return type; }
std::string Task::getTaskName() const { return taskName; }
int Task::getDurationSec() const { return estimatedDurationSec; }
int Task::getDynamicPriority() const { return dynamicPriority; }
int Task::getDeadlineMinutes() const { return deadlineMinutes; }
TaskStatus Task::getStatus() const { return status; }
void Task::setStatus(TaskStatus s) { status = s; }
int Task::getRetryCount() const { return retryCount; }
void Task::incrementRetry(const std::string& reason) { retryCount++; failureReason = reason; }
int Task::getMaxRetries() const { return maxRetries; }
std::string Task::getAssignedWorkerId() const { return assignedWorkerId; }
void Task::setAssignedWorkerId(const std::string& wId) { assignedWorkerId = wId; }
std::string Task::getAssignedHub() const { return assignedHub; }
std::string Task::getDetails() const { return details; }
const std::vector<std::string>& Task::getDependencies() const { return dependencyTaskIds; }
const std::vector<std::string>& Task::getHistory() const { return eventHistory; }

// PickingTask Implementation
PickingTask::PickingTask(std::string tId, std::string oId, std::string itemName, std::string aisle, std::string shelf,
                         int prio, int deadlineMins, std::string hub)
    : Task(tId, oId, TaskType::PICK_ITEM, "Pick " + itemName + " from " + aisle + " / " + shelf,
           12, prio, deadlineMins, hub, itemName, {}),
      aisleLocation(aisle), shelfLocation(shelf) {}

std::string PickingTask::getTypeName() const { return "Picking Task"; }

std::string PickingTask::getExecutionInstructions() const {
    return "Dispatch AGV pod to " + aisleLocation + ", " + shelfLocation + " and scan RFID tag.";
}

// PackingTask Implementation
PackingTask::PackingTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                         std::string hub, std::vector<std::string> pickDeps)
    : Task(tId, oId, TaskType::PACK_ORDER, "Tamper-Proof Apple Packaging & Cushioning",
           10, prio, deadlineMins, hub, "All Items", pickDeps) {}

std::string PackingTask::getTypeName() const { return "Packing Task"; }

std::string PackingTask::getExecutionInstructions() const {
    return "Place items in shock-absorbent thermal Apple carton and apply cryptographic tamper-evident seal.";
}

// QualityCheckTask Implementation
QualityCheckTask::QualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                                   std::string hub, std::vector<std::string> packDeps)
    : Task(tId, oId, TaskType::QUALITY_CHECK, "Laser Barcode, Serial & Damage Verification",
           8, prio + 1, deadlineMins, hub, "Vision Inspection", packDeps) {}

std::string QualityCheckTask::getTypeName() const { return "Quality Check Task"; }

std::string QualityCheckTask::getExecutionInstructions() const {
    return "Calibrate precision weight and execute automated 4K laser barcode serial read.";
}

// ShippingTask Implementation
ShippingTask::ShippingTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                           std::string hub, std::vector<std::string> qcDeps)
    : Task(tId, oId, TaskType::SHIP_ORDER, "Hyperlocal Air Courier Dispatch & Handover",
           6, prio + 2, deadlineMins, hub, "Air Express Node", qcDeps) {}

std::string ShippingTask::getTypeName() const { return "Shipping Task"; }

std::string ShippingTask::getExecutionInstructions() const {
    return "Transfer sealed package to QuickFlow Air Express dock and generate delivery OTP token.";
}

// TaskFactory Implementation
std::shared_ptr<Task> TaskFactory::createPickingTask(std::string tId, std::string oId, std::string itemName,
                                                    std::string aisle, std::string shelf, int prio, int deadlineMins, std::string hub) {
    return std::make_shared<PickingTask>(tId, oId, itemName, aisle, shelf, prio, deadlineMins, hub);
}

std::shared_ptr<Task> TaskFactory::createPackingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                               std::string hub, std::vector<std::string> pickDeps) {
    return std::make_shared<PackingTask>(tId, oId, prio, deadlineMins, hub, pickDeps);
}

std::shared_ptr<Task> TaskFactory::createQualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                     std::string hub, std::vector<std::string> packDeps) {
    return std::make_shared<QualityCheckTask>(tId, oId, prio, deadlineMins, hub, packDeps);
}

std::shared_ptr<Task> TaskFactory::createShippingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                std::string hub, std::vector<std::string> qcDeps) {
    return std::make_shared<ShippingTask>(tId, oId, prio, deadlineMins, hub, qcDeps);
}
