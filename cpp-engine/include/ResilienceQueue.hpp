#pragma once
#include <string>
#include <vector>
#include "Compat.hpp"
#include <chrono>
#include <sstream>
#include "Task.hpp"

struct ManualReviewItem {
    std::string reviewId;
    std::string orderId;
    std::string taskId;
    std::string taskName;
    std::string hub;
    std::string reason;
    int retryAttempts;
    std::string timestamp;
    std::string status; // "PENDING_REVIEW", "RESOLVED_RETRY", "RESOLVED_REROUTE"
};

class ResilienceQueue {
private:
    std::vector<ManualReviewItem> reviewItems;
    mutable std::mutex queueMutex;

public:
    void addItem(const FulfillmentTask& task, const std::string& reason) {
        std::lock_guard<std::mutex> lock(queueMutex);
        std::stringstream ss;
        ss << "REV-" << (1000 + reviewItems.size() + 1);
        
        reviewItems.push_back({
            ss.str(),
            task.getOrderId(),
            task.getTaskId(),
            task.getTaskName(),
            task.getAssignedHub(),
            reason.empty() ? "Max retries exceeded (3/3 attempts failed)" : reason,
            task.getRetryCount(),
            "Just now",
            "PENDING_REVIEW"
        });
    }

    bool resolveWithRetry(const std::string& reviewId) {
        std::lock_guard<std::mutex> lock(queueMutex);
        for (auto& item : reviewItems) {
            if (item.reviewId == reviewId) {
                item.status = "RESOLVED_RETRY";
                return true;
            }
        }
        return false;
    }

    bool resolveWithReroute(const std::string& reviewId, const std::string& newHub) {
        std::lock_guard<std::mutex> lock(queueMutex);
        for (auto& item : reviewItems) {
            if (item.reviewId == reviewId) {
                item.status = "RESOLVED_REROUTE";
                item.hub = newHub;
                return true;
            }
        }
        return false;
    }

    const std::vector<ManualReviewItem>& getItems() const {
        return reviewItems;
    }

    size_t getPendingCount() const {
        std::lock_guard<std::mutex> lock(queueMutex);
        size_t count = 0;
        for (const auto& item : reviewItems) {
            if (item.status == "PENDING_REVIEW") count++;
        }
        return count;
    }
};
