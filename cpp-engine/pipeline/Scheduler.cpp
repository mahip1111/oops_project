#include "pipeline/Scheduler.hpp"
#include <algorithm>
#include <iostream>

// FIFOSchedulingStrategy
std::string FIFOSchedulingStrategy::getName() const {
    return "FIFO (First-In, First-Out)";
}

void FIFOSchedulingStrategy::sortQueue(std::vector<FulfillmentTask>& queue) {
    // Preserves existing arrival sequence
}

// PrioritySchedulingStrategy
std::string PrioritySchedulingStrategy::getName() const {
    return "Priority-First (Highest Value & Urgency)";
}

void PrioritySchedulingStrategy::sortQueue(std::vector<FulfillmentTask>& queue) {
    std::sort(queue.begin(), queue.end(), [](const FulfillmentTask& a, const FulfillmentTask& b) {
        return a.getDynamicPriority() > b.getDynamicPriority();
    });
}

// DeadlineSchedulingStrategy
std::string DeadlineSchedulingStrategy::getName() const {
    return "Deadline (Earliest Deadline First / EDF)";
}

void DeadlineSchedulingStrategy::sortQueue(std::vector<FulfillmentTask>& queue) {
    std::sort(queue.begin(), queue.end(), [](const FulfillmentTask& a, const FulfillmentTask& b) {
        return a.getDeadlineMinutes() < b.getDeadlineMinutes();
    });
}

// HybridSchedulingStrategy
std::string HybridSchedulingStrategy::getName() const {
    return "Hybrid (Dynamic Priority + Deadline Signals)";
}

void HybridSchedulingStrategy::sortQueue(std::vector<FulfillmentTask>& queue) {
    std::sort(queue.begin(), queue.end(), [](const FulfillmentTask& a, const FulfillmentTask& b) {
        double scoreA = (a.getDynamicPriority() * 10.0) - (a.getDeadlineMinutes() * 0.5);
        double scoreB = (b.getDynamicPriority() * 10.0) - (b.getDeadlineMinutes() * 0.5);
        return scoreA > scoreB;
    });
}

// Scheduler Implementation
Scheduler::Scheduler(std::unique_ptr<ISchedulingStrategy> initialStrategy)
    : strategy(std::move(initialStrategy)) {
    initializeWorkers();
}

void Scheduler::setStrategy(std::unique_ptr<ISchedulingStrategy> newStrategy) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    strategy = std::move(newStrategy);
    if (strategy) strategy->sortQueue(taskQueue);
}

std::string Scheduler::getStrategyName() const {
    return strategy ? strategy->getName() : "None";
}

void Scheduler::initializeWorkers() {
    workerPool.clear();
    workerPool.push_back({"AGV-101", "AGV Pod Alpha", "PICKING", "AGV Autonomous Pod", "BOM-04", true, "", 48, 99.2});
    workerPool.push_back({"AGV-102", "AGV Pod Beta", "PICKING", "AGV Autonomous Pod", "BOM-04", true, "", 42, 98.7});
    workerPool.push_back({"AGV-103", "AGV Pod Gamma", "PICKING", "AGV Autonomous Pod", "DEL-01", true, "", 51, 99.0});
    workerPool.push_back({"WRK-201", "Aarav Sharma", "PICKING", "Station Specialist", "BOM-04", true, "", 65, 96.5});
    workerPool.push_back({"WRK-202", "Priya Nair", "QUALITY_CHECK", "Lead QC Inspector", "BOM-04", true, "", 72, 99.8});
    workerPool.push_back({"WRK-203", "Rahul Verma", "PACKING", "Packaging Specialist", "BOM-04", true, "", 58, 97.4});
    workerPool.push_back({"WRK-204", "Sneha Patel", "SHIPPING", "Courier Dispatch Lead", "DEL-01", true, "", 61, 99.1});
}

void Scheduler::enqueueTask(const FulfillmentTask& task) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    taskQueue.push_back(task);
    if (strategy) strategy->sortQueue(taskQueue);
}

void Scheduler::enqueueBatch(const std::vector<FulfillmentTask>& tasks) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    for (const auto& t : tasks) {
        taskQueue.push_back(t);
    }
    if (strategy) strategy->sortQueue(taskQueue);
}

void Scheduler::enqueueTasks(const std::vector<FulfillmentTask>& tasks) {
    enqueueBatch(tasks);
}

bool Scheduler::areDependenciesCompleted(const FulfillmentTask& task) const {
    for (const auto& depId : task.getDependencies()) {
        auto it = std::find_if(taskQueue.begin(), taskQueue.end(), [&](const FulfillmentTask& t) {
            return t.getTaskId() == depId;
        });
        if (it != taskQueue.end() && it->getStatus() != TaskStatus::COMPLETED) {
            return false;
        }
    }
    return true;
}

void Scheduler::updateDynamicPriorities(int elapsedMinutes) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    for (auto& task : taskQueue) {
        int remaining = std::max(1, task.getDeadlineMinutes() - elapsedMinutes);
        task.updateDynamicPriority(remaining);
    }
    if (strategy) strategy->sortQueue(taskQueue);
}

std::vector<std::pair<FulfillmentTask, WorkerNode>> Scheduler::dispatchNextBatch() {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    std::vector<std::pair<FulfillmentTask, WorkerNode>> assignments;

    // First unlock any tasks whose dependencies are satisfied
    for (auto& task : taskQueue) {
        if (task.getStatus() == TaskStatus::BLOCKED_BY_DEPENDENCY) {
            if (areDependenciesCompleted(task)) {
                task.setStatus(TaskStatus::PENDING);
                task.addHistory("Upstream dependencies fulfilled. Unlocked to PENDING.");
            }
        }
    }

    // Assign pending tasks
    for (auto& task : taskQueue) {
        if (task.getStatus() != TaskStatus::PENDING) continue;

        std::string requiredDept = "";
        switch (task.getType()) {
            case TaskType::PICK_ITEM: requiredDept = "PICKING"; break;
            case TaskType::PACK_ORDER: requiredDept = "PACKING"; break;
            case TaskType::QUALITY_CHECK: requiredDept = "QUALITY_CHECK"; break;
            case TaskType::SHIP_ORDER: requiredDept = "SHIPPING"; break;
        }

        for (auto& worker : workerPool) {
            if (worker.isAvailable && (worker.department == requiredDept || worker.department == "PICKING")) {
                worker.isAvailable = false;
                worker.currentTaskId = task.getTaskId();
                task.setStatus(TaskStatus::IN_PROGRESS);
                task.setAssignedWorkerId(worker.id);
                task.addHistory("Dispatched to worker: " + worker.name + " (" + worker.role + ")");
                assignments.push_back({task, worker});
                break;
            }
        }
    }

    return assignments;
}

void Scheduler::completeTask(const std::string& taskId) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    for (auto& task : taskQueue) {
        if (task.getTaskId() == taskId) {
            task.setStatus(TaskStatus::COMPLETED);
            task.addHistory("Task successfully completed.");

            for (auto& worker : workerPool) {
                if (worker.currentTaskId == taskId) {
                    worker.isAvailable = true;
                    worker.currentTaskId = "";
                    worker.tasksCompletedToday++;
                    break;
                }
            }
            break;
        }
    }
}

void Scheduler::failTask(const std::string& taskId, const std::string& reason, bool& sentToManualReview) {
    std::lock_guard<std::mutex> lock(schedulerMutex);
    sentToManualReview = false;

    for (auto& task : taskQueue) {
        if (task.getTaskId() == taskId) {
            task.incrementRetry(reason);

            // Free worker
            for (auto& worker : workerPool) {
                if (worker.currentTaskId == taskId) {
                    worker.isAvailable = true;
                    worker.currentTaskId = "";
                    break;
                }
            }

            if (task.getRetryCount() >= task.getMaxRetries()) {
                task.setStatus(TaskStatus::MANUAL_REVIEW);
                task.addHistory("Failed attempt " + std::to_string(task.getRetryCount()) + "/" + 
                                std::to_string(task.getMaxRetries()) + ": Quarantined for Manual Review.");
                sentToManualReview = true;
            } else {
                task.setStatus(TaskStatus::PENDING);
                task.addHistory("Failed attempt " + std::to_string(task.getRetryCount()) + "/" + 
                                std::to_string(task.getMaxRetries()) + ": Re-queued for retry with alternative worker.");
            }
            break;
        }
    }
    if (strategy) strategy->sortQueue(taskQueue);
}

const std::vector<WorkerNode>& Scheduler::getWorkers() const {
    return workerPool;
}

const std::vector<FulfillmentTask>& Scheduler::getQueue() const {
    return taskQueue;
}
