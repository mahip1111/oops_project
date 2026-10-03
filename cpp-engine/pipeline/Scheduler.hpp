#pragma once
#include <string>
#include <vector>
#include <memory>
#include <utility>
#include "core/Compat.hpp"
#include "pipeline/Task.hpp"

/**
 * @class ISchedulingStrategy
 * @brief Strategy Pattern Interface for pluggable task dispatch sorting algorithms.
 */
class ISchedulingStrategy {
public:
    virtual ~ISchedulingStrategy() = default;
    virtual std::string getName() const = 0;
    virtual void sortQueue(std::vector<FulfillmentTask>& queue) = 0;
};

// 1. FIFO Strategy
class FIFOSchedulingStrategy : public ISchedulingStrategy {
public:
    std::string getName() const override;
    void sortQueue(std::vector<FulfillmentTask>& queue) override;
};

// 2. Priority Strategy
class PrioritySchedulingStrategy : public ISchedulingStrategy {
public:
    std::string getName() const override;
    void sortQueue(std::vector<FulfillmentTask>& queue) override;
};

// 3. Deadline Strategy (EDF)
class DeadlineSchedulingStrategy : public ISchedulingStrategy {
public:
    std::string getName() const override;
    void sortQueue(std::vector<FulfillmentTask>& queue) override;
};

// 4. Hybrid Strategy (Priority + EDF Signals)
class HybridSchedulingStrategy : public ISchedulingStrategy {
public:
    std::string getName() const override;
    void sortQueue(std::vector<FulfillmentTask>& queue) override;
};

// Aliases
using FIFOScheduler = FIFOSchedulingStrategy;
using PriorityScheduler = PrioritySchedulingStrategy;
using DeadlineScheduler = DeadlineSchedulingStrategy;
using HybridScheduler = HybridSchedulingStrategy;

/**
 * @struct WorkerNode
 * @brief Worker status profile for scheduler dispatch.
 */
struct WorkerNode {
    std::string id;
    std::string name;
    std::string department;
    std::string role;
    std::string hub;
    bool isAvailable;
    std::string currentTaskId;
    int tasksCompletedToday;
    double efficiency;
};

/**
 * @class Scheduler
 * @brief Core dispatch orchestrator utilizing runtime Strategy Pattern algorithms and DAG dependencies.
 */
class Scheduler {
private:
    std::unique_ptr<ISchedulingStrategy> strategy;
    std::vector<FulfillmentTask> taskQueue;
    std::vector<WorkerNode> workerPool;
    mutable std::mutex schedulerMutex;

public:
    Scheduler(std::unique_ptr<ISchedulingStrategy> initialStrategy = std::make_unique<HybridSchedulingStrategy>());

    void setStrategy(std::unique_ptr<ISchedulingStrategy> newStrategy);
    std::string getStrategyName() const;

    void initializeWorkers();
    void enqueueTask(const FulfillmentTask& task);
    void enqueueBatch(const std::vector<FulfillmentTask>& tasks);
    void enqueueTasks(const std::vector<FulfillmentTask>& tasks);

    bool areDependenciesCompleted(const FulfillmentTask& task) const;
    void updateDynamicPriorities(int elapsedMinutes);
    std::vector<std::pair<FulfillmentTask, WorkerNode>> dispatchNextBatch();
    void completeTask(const std::string& taskId);
    void failTask(const std::string& taskId, const std::string& reason, bool& sentToManualReview);

    const std::vector<WorkerNode>& getWorkers() const;
    const std::vector<FulfillmentTask>& getQueue() const;
};
