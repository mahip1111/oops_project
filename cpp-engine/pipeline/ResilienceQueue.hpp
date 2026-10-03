#pragma once
#include <string>
#include <vector>
#include "core/Compat.hpp"
#include "pipeline/Task.hpp"

/**
 * @struct ManualReviewItem
 * @brief Quarantined task record pending human operator or automated supervisor resolution.
 */
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

/**
 * @class ResilienceQueue
 * @brief Circuit breaker quarantine queue managing failed tasks exceeding max retry thresholds.
 */
class ResilienceQueue {
private:
    std::vector<ManualReviewItem> reviewItems;
    mutable std::mutex queueMutex;

public:
    ResilienceQueue() = default;

    void addItem(const FulfillmentTask& task, const std::string& reason);
    bool resolveWithRetry(const std::string& reviewId);
    bool resolveWithReroute(const std::string& reviewId, const std::string& newHub);
    const std::vector<ManualReviewItem>& getItems() const;
    size_t getPendingCount() const;
};
