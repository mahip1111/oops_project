#include "warehouse/WorkerManager.hpp"

// Worker Implementation
Worker::Worker(std::string wId, std::string wName, std::string dept, std::string rRole, 
               std::string hub, double eff)
    : id(wId), name(wName), department(dept), role(rRole), hubId(hub),
      available(true), activeTaskId(""), completedTasksCount(0), efficiency(eff) {}

std::string Worker::getId() const { return id; }
std::string Worker::getName() const { return name; }
std::string Worker::getDepartment() const { return department; }
std::string Worker::getRole() const { return role; }
std::string Worker::getHubId() const { return hubId; }
bool Worker::isAvailable() const { return available; }
void Worker::setAvailable(bool a) { available = a; }
std::string Worker::getActiveTaskId() const { return activeTaskId; }
void Worker::setActiveTaskId(const std::string& tId) { activeTaskId = tId; }
int Worker::getCompletedTasksCount() const { return completedTasksCount; }
void Worker::incrementCompletedTasks() { completedTasksCount++; }
double Worker::getEfficiency() const { return efficiency; }

// WorkerManager Implementation
WorkerManager::WorkerManager() {
    registerWorker(std::make_shared<Worker>("AGV-101", "AGV Pod Alpha", "PICKING", "AGV Autonomous Pod", "BOM-04", 99.2));
    registerWorker(std::make_shared<Worker>("AGV-102", "AGV Pod Beta", "PICKING", "AGV Autonomous Pod", "BOM-04", 98.7));
    registerWorker(std::make_shared<Worker>("AGV-103", "AGV Pod Gamma", "PICKING", "AGV Autonomous Pod", "DEL-01", 99.0));
    registerWorker(std::make_shared<Worker>("WRK-201", "Aarav Sharma", "PICKING", "Station Specialist", "BOM-04", 96.5));
    registerWorker(std::make_shared<Worker>("WRK-202", "Priya Nair", "QUALITY_CHECK", "Lead QC Inspector", "BOM-04", 99.8));
    registerWorker(std::make_shared<Worker>("WRK-203", "Rahul Verma", "PACKING", "Thermal Packaging Pro", "BOM-04", 97.4));
    registerWorker(std::make_shared<Worker>("WRK-204", "Sneha Patel", "SHIPPING", "Courier Dispatch Lead", "BOM-04", 99.1));
}

void WorkerManager::registerWorker(std::shared_ptr<Worker> worker) {
    std::lock_guard<std::mutex> lock(workerMutex);
    workerRoster[worker->getId()] = worker;
}

std::shared_ptr<Worker> WorkerManager::getWorkerById(const std::string& id) const {
    std::lock_guard<std::mutex> lock(workerMutex);
    auto it = workerRoster.find(id);
    return it != workerRoster.end() ? it->second : nullptr;
}

std::shared_ptr<Worker> WorkerManager::findBestAvailableWorker(const std::string& department, const std::string& hubId) {
    std::lock_guard<std::mutex> lock(workerMutex);
    std::shared_ptr<Worker> bestWorker = nullptr;

    for (const auto& pair : workerRoster) {
        const auto& worker = pair.second;
        if (worker->isAvailable() && (worker->getDepartment() == department || worker->getDepartment() == "PICKING")) {
            if (!bestWorker || worker->getEfficiency() > bestWorker->getEfficiency()) {
                bestWorker = worker;
            }
        }
    }
    return bestWorker;
}

std::vector<std::shared_ptr<Worker>> WorkerManager::getAllWorkers() const {
    std::lock_guard<std::mutex> lock(workerMutex);
    std::vector<std::shared_ptr<Worker>> list;
    list.reserve(workerRoster.size());
    for (const auto& pair : workerRoster) {
        list.push_back(pair.second);
    }
    return list;
}
