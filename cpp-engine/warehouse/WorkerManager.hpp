#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include "core/Compat.hpp"
#include "pipeline/Task.hpp"

/**
 * @class Worker
 * @brief Represents a physical worker, robotics station, or AGV autonomous pod.
 */
class Worker {
private:
    std::string id;
    std::string name;
    std::string department; // "PICKING", "PACKING", "QUALITY_CHECK", "SHIPPING"
    std::string role;       // "AGV Autonomous Pod", "Robotic Arm", "Station Specialist", "QC Inspector"
    std::string hubId;
    bool available;
    std::string activeTaskId;
    int completedTasksCount;
    double efficiency;

public:
    Worker(std::string wId, std::string wName, std::string dept, std::string rRole, 
           std::string hub, double eff = 98.5);

    // Getters & Setters
    std::string getId() const;
    std::string getName() const;
    std::string getDepartment() const;
    std::string getRole() const;
    std::string getHubId() const;
    bool isAvailable() const;
    void setAvailable(bool a);
    std::string getActiveTaskId() const;
    void setActiveTaskId(const std::string& tId);
    int getCompletedTasksCount() const;
    void incrementCompletedTasks();
    double getEfficiency() const;
};

/**
 * @class WorkerManager
 * @brief Centralized registry and allocation manager for workforce and robotic AGV fleets.
 */
class WorkerManager {
private:
    std::unordered_map<std::string, std::shared_ptr<Worker>> workerRoster;
    mutable std::mutex workerMutex;

public:
    WorkerManager();

    void registerWorker(std::shared_ptr<Worker> worker);
    std::shared_ptr<Worker> getWorkerById(const std::string& id) const;
    std::shared_ptr<Worker> findBestAvailableWorker(const std::string& department, const std::string& hubId);
    std::vector<std::shared_ptr<Worker>> getAllWorkers() const;
};
