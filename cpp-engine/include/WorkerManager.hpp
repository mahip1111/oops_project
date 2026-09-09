#pragma once
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>
#include <mutex>
#include "Task.hpp"

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
    Worker(std::string wId, std::string wName, std::string dept, std::string rRole, std::string hub, double eff = 98.5)
        : id(wId), name(wName), department(dept), role(rRole), hubId(hub),
          available(true), activeTaskId(""), completedTasksCount(0), efficiency(eff) {}

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getDepartment() const { return department; }
    std::string getRole() const { return role; }
    std::string getHubId() const { return hubId; }
    bool isAvailable() const { return available; }
    void setAvailable(bool a) { available = a; }
    std::string getActiveTaskId() const { return activeTaskId; }
    void setActiveTaskId(const std::string& tId) { activeTaskId = tId; }
    int getCompletedTasksCount() const { return completedTasksCount; }
    void incrementCompletedTasks() { completedTasksCount++; }
    double getEfficiency() const { return efficiency; }
};

class WorkerManager {
private:
    std::unordered_map<std::string, std::shared_ptr<Worker>> workerRoster; // HashMap lookup (PRD Section 6)
    mutable std::mutex workerMutex;

public:
    WorkerManager() {
        registerWorker(std::make_shared<Worker>("AGV-101", "AGV Pod Alpha", "PICKING", "AGV Autonomous Pod", "BOM-04", 99.2));
        registerWorker(std::make_shared<Worker>("AGV-102", "AGV Pod Beta", "PICKING", "AGV Autonomous Pod", "BOM-04", 98.7));
        registerWorker(std::make_shared<Worker>("AGV-103", "AGV Pod Gamma", "PICKING", "AGV Autonomous Pod", "DEL-01", 99.0));
        registerWorker(std::make_shared<Worker>("WRK-201", "Aarav Sharma", "PICKING", "Station Specialist", "BOM-04", 96.5));
        registerWorker(std::make_shared<Worker>("WRK-202", "Priya Nair", "QUALITY_CHECK", "Lead QC Inspector", "BOM-04", 99.8));
        registerWorker(std::make_shared<Worker>("WRK-203", "Rahul Verma", "PACKING", "Thermal Packaging Pro", "BOM-04", 97.4));
        registerWorker(std::make_shared<Worker>("WRK-204", "Sneha Patel", "SHIPPING", "Courier Dispatch Lead", "BOM-04", 99.1));
    }

    void registerWorker(std::shared_ptr<Worker> worker) {
        std::lock_guard<std::mutex> lock(workerMutex);
        workerRoster[worker->getId()] = worker;
    }

    std::shared_ptr<Worker> getWorkerById(const std::string& id) const {
        std::lock_guard<std::mutex> lock(workerMutex);
        auto it = workerRoster.find(id);
        return it != workerRoster.end() ? it->second : nullptr;
    }

    std::shared_ptr<Worker> findBestAvailableWorker(const std::string& department, const std::string& hubId) {
        std::lock_guard<std::mutex> lock(workerMutex);
        std::shared_ptr<Worker> bestWorker = nullptr;

        for (const auto& [id, worker] : workerRoster) {
            if (worker->isAvailable() && (worker->getDepartment() == department || worker->getDepartment() == "PICKING")) {
                if (!bestWorker || worker->getEfficiency() > bestWorker->getEfficiency()) {
                    bestWorker = worker;
                }
            }
        }
        return bestWorker;
    }

    std::vector<std::shared_ptr<Worker>> getAllWorkers() const {
        std::lock_guard<std::mutex> lock(workerMutex);
        std::vector<std::shared_ptr<Worker>> list;
        for (const auto& [id, w] : workerRoster) {
            list.push_back(w);
        }
        return list;
    }
};
