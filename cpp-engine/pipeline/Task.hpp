#pragma once
#include <string>
#include <vector>
#include <memory>

/**
 * @enum TaskType
 * @brief Discrete fulfillment pipeline task types.
 */
enum class TaskType {
    PICK_ITEM,
    PACK_ORDER,
    QUALITY_CHECK,
    SHIP_ORDER
};

/**
 * @enum TaskStatus
 * @brief Execution state of an individual fulfillment task.
 */
enum class TaskStatus {
    PENDING,
    BLOCKED_BY_DEPENDENCY,
    ASSIGNED,
    IN_PROGRESS,
    COMPLETED,
    FAILED,
    MANUAL_REVIEW
};

/**
 * @class Task
 * @brief Polymorphic base class for fulfillment tasks within the execution DAG.
 */
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
         std::vector<std::string> deps = {});

    virtual ~Task() = default;

    virtual std::string getTypeName() const;
    virtual std::string getExecutionInstructions() const;
    std::string getStatusName() const;

    void updateDynamicPriority(int remainingMinutes);
    void addHistory(const std::string& entry);

    // Getters & Setters
    std::string getTaskId() const;
    std::string getOrderId() const;
    TaskType getType() const;
    std::string getTaskName() const;
    int getDurationSec() const;
    int getDynamicPriority() const;
    int getDeadlineMinutes() const;
    TaskStatus getStatus() const;
    void setStatus(TaskStatus s);
    int getRetryCount() const;
    void incrementRetry(const std::string& reason);
    int getMaxRetries() const;
    std::string getAssignedWorkerId() const;
    void setAssignedWorkerId(const std::string& wId);
    std::string getAssignedHub() const;
    std::string getDetails() const;
    const std::vector<std::string>& getDependencies() const;
    const std::vector<std::string>& getHistory() const;
};

/**
 * @class PickingTask
 * @brief Derived Task for warehouse aisle picking.
 */
class PickingTask : public Task {
private:
    std::string aisleLocation;
    std::string shelfLocation;

public:
    PickingTask(std::string tId, std::string oId, std::string itemName, 
                std::string aisle, std::string shelf, int prio, int deadlineMins, std::string hub);

    std::string getTypeName() const override;
    std::string getExecutionInstructions() const override;
};

/**
 * @class PackingTask
 * @brief Derived Task for tamper-proof packaging.
 */
class PackingTask : public Task {
public:
    PackingTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                std::string hub, std::vector<std::string> pickDeps);

    std::string getTypeName() const override;
    std::string getExecutionInstructions() const override;
};

/**
 * @class QualityCheckTask
 * @brief Derived Task for automated barcode and RFID verification.
 */
class QualityCheckTask : public Task {
public:
    QualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                     std::string hub, std::vector<std::string> packDeps);

    std::string getTypeName() const override;
    std::string getExecutionInstructions() const override;
};

/**
 * @class ShippingTask
 * @brief Derived Task for courier dispatch and handover.
 */
class ShippingTask : public Task {
public:
    ShippingTask(std::string tId, std::string oId, int prio, int deadlineMins, 
                 std::string hub, std::vector<std::string> qcDeps);

    std::string getTypeName() const override;
    std::string getExecutionInstructions() const override;
};

/**
 * @class TaskFactory
 * @brief Factory Pattern implementation creating polymorphic Task instances.
 */
class TaskFactory {
public:
    static std::shared_ptr<Task> createPickingTask(std::string tId, std::string oId, std::string itemName,
                                                    std::string aisle, std::string shelf, int prio, int deadlineMins, std::string hub);

    static std::shared_ptr<Task> createPackingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                   std::string hub, std::vector<std::string> pickDeps);

    static std::shared_ptr<Task> createQualityCheckTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                         std::string hub, std::vector<std::string> packDeps);

    static std::shared_ptr<Task> createShippingTask(std::string tId, std::string oId, int prio, int deadlineMins,
                                                    std::string hub, std::vector<std::string> qcDeps);
};

using FulfillmentTask = Task; // Backward compatibility alias
