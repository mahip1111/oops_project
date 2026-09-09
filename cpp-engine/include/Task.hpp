#pragma once
#include <string>
#include <vector>
#include <chrono>
#include <algorithm>
#include <memory>

enum class TaskType {
    PICK_ITEM,
    PACK_ORDER,
    QUALITY_CHECK,
    SHIP_ORDER
};

enum class TaskStatus {
    PENDING,
    BLOCKED_BY_DEPENDENCY,
    ASSIGNED,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    MANUAL_REVIEW
};

// Base Class: Task (Polymorphic Domain Model - PRD Section 4)
class Task {
protected:
    std::string taskId;
    std::string orderId;
    TaskType type;
    std::string taskName;
    int estimatedDurationSec;
    int basePriority;
    int dynamicPriority;
    int deadlineMinutes;
    TaskStatus status;
    int retryCount;
    int maxRetries;
    std::string assignedWorkerId;
    std::string assignedHub;
    std::string failureReason;
    std::string details;
    std::vector<std::string> dependencyTaskIds;
    std::vector<std::string> eventHistory;

public:
    Task(std::string tId, std::string oId, TaskType tType, std::string name, int duration,
         int prio, int deadlineMins, std::string hub, std::string detailStr = "",
         std::vector<std::string> deps = {})
        : taskId(tId), orderId(oId), type(tType), taskName(name), estimatedDurationSec(duration),
          basePriority(prio), dynamicPriority(prio), deadlineMinutes(deadlineMins),
          status(deps.empty() ? TaskStatus::PENDING : TaskStatus::BLOCKED_BY_DEPENDENCY),
          retryCount(0), maxRetries(3), assignedWorkerId("UNASSIGNED"), assignedHub(hub),
          failureReason(""), details(detailStr), dependencyTaskIds(deps) {
        eventHistory.push_back("Task created in state: " + getStatusName());
    }

    virtual ~Task() = default;

    virtual std::string getTypeName() const {
        switch (type) {
            case TaskType::PICK_ITEM: return "Picking Task";
            case TaskType::PACK_ORDER: return "Packing Task";
            case TaskType::QUALITY_CHECK: return "Quality Check Task";
            case TaskType::SHIP_ORDER: return "Shipping Task";
            default: return "Generic Task";
        }
    }

    virtual std::string getExecutionInstructions() const {
        return details.empty() ? "Execute assigned fulfillment task operation." : details;
    }

    std::string getStatusName() const {
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

    void updateDynamicPriority(int remainingMinutes) {
        deadlineMinutes = remainingMinutes;
        if (remainingMinutes <= 15) {
            dynamicPriority = std::min(10, basePriority + 4);
        } else if (remainingMinutes <= 30) {
            dynamicPriority = std::min(10, basePriority + 2);
        } else {
            dynamicPriority = basePriority;
        }
    }

    void addHistory(const std::string& entry) {
        eventHistory.push_back(entry);
    }

    // Getters & Setters
    std::string getTaskId() const { return taskId; }
    std::string getOrderId() const { return orderId; }
    TaskType getType() const { return type; }
    std::string getTaskName() const { return taskName; }
    int getDurationSec() const { return estimatedDurationSec; }
    int getDynamicPriority() const { return dynamicPriority; }
    int getDeadlineMinutes() const { return deadlineMinutes; }
    TaskStatus getStatus() const { return status; }
    void setStatus(TaskStatus s) { status = s; }
    int getRetryCount() const { return retryCount; }
    void incrementRetry(const std::string& reason) { retryCount++; failureReason = reason; }
    int getMaxRetries() const { return maxRetries; }
    std::string getAssignedWorkerId() const { return assignedWorkerId; }
    void setAssignedWorkerId(const std::string& wId) { assignedWorkerId = wId; }
    std::string getAssignedHub() const { return assignedHub; }
    std::string getDetails() const { return details; }
    const std::vector<std::string>& getDependencies() const { return dependencyTaskIds; }
    const std::vector<std::string>& getHistory() const { return eventHistory; }
};

// Derived Class 1: PickingTask (PRD Section 4)
class PickingTask : public Task {
private:
    std::string aisleLocation;
    std::string shelfLocation;

public:
    PickingTask(std::string tId, std::string oId, std::string itemName, std::string aisle, std::string shelf,
                int prio, int deadlineMins, std::string hub)
        : Task(tId, oId, TaskType::PICK_ITEM, "Pick " + itemName + " from " + aisle + " / " + shelf,
               12, prio, deadlineMins, hub, itemName, {}),
          aisleLocation(aisle), shelfLocation(shelf) {}

    std::string getTypeName() const override { return "Picking Task"; }
    std::string getExecutionInstructions() const override {
        return "Dispatch AGV pod to " + aisleLocation + ", " + shelfLocation + " and scan RFID tag.";
    }
};

// Derived Class 2: PackingTask (PRD Section 4)
class PackingTask : public Task {
public:
    PackingTask(std::string tId, std::string oId, int prio, int deadlineMins, std::string hub, std::vector<std::string> pickDeps)
        : Task(tId, oId, TaskType::PACK_ORDER, "Tamper-Proof Apple Packaging & Cushioning",
               10, prio, deadlineMins, hub, "All Items", pickDeps) {}

    std::string getTypeName() const override { return "Packing Task"; }
    std::string getExecutionInstructions() const override {
        return "Place items in shock-absorbent thermal Apple carton and apply cryptographic tamper-evident seal.";
    }
};

// Derived Class 3: QualityCheckTask (PRD Section 4)
class QualityCheckTask : public Task {
public:
    QualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins, std::string hub, std::vector<std::string> packDeps)
        : Task(tId, oId, TaskType::QUALITY_CHECK, "Laser Barcode, Serial & Damage Verification",
               8, prio + 1, deadlineMins, hub, "Vision Inspection", packDeps) {}

    std::string getTypeName() const override { return "Quality Check Task"; }
    std::string getExecutionInstructions() const override {
        return "Calibrate precision weight and execute automated 4K laser barcode serial read.";
    }
};

// Derived Class 4: ShippingTask (PRD Section 4)
class ShippingTask : public Task {
public:
    ShippingTask(std::string tId, std::string oId, int prio, int deadlineMins, std::string hub, std::vector<std::string> qcDeps)
        : Task(tId, oId, TaskType::SHIP_ORDER, "Hyperlocal Air Courier Dispatch & Handover",
               6, prio + 2, deadlineMins, hub, "Air Express Node", qcDeps) {}

    std::string getTypeName() const override { return "Shipping Task"; }
    std::string getExecutionInstructions() const override {
        return "Transfer sealed package to QuickFlow Air Express dock and generate delivery OTP token.";
    }
};

// Factory Pattern: TaskFactory (PRD Section 5)
class TaskFactory {
public:
    static std::shared_ptr<Task> createPickingTask(std::string tId, std::string oId, std::string itemName,
                                                    std::string aisle, std::string shelf, int prio, int deadlineMins, std::string hub) {
        return std::make_shared<PickingTask>(tId, oId, itemName, aisle, shelf, prio, deadlineMins, hub);
    }

    static std::shared_ptr<Task> createPackingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                   std::string hub, std::vector<std::string> pickDeps) {
        return std::make_shared<PackingTask>(tId, oId, prio, deadlineMins, hub, pickDeps);
    }

    static std::shared_ptr<Task> createQualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                         std::string hub, std::vector<std::string> packDeps) {
        return std::make_shared<QualityCheckTask>(tId, oId, prio, deadlineMins, hub, packDeps);
    }

    static std::shared_ptr<Task> createShippingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                    std::string hub, std::vector<std::string> qcDeps) {
        return std::make_shared<ShippingTask>(tId, oId, prio, deadlineMins, hub, qcDeps);
    }
};

using FulfillmentTask = Task; // Backward compatibility alias
