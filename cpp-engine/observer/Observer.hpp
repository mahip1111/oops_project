#pragma once
#include <string>
#include <memory>

/**
 * @enum OrderEventNotificationType
 * @brief Discrete notification event types broadcast across the system.
 */
enum class OrderEventNotificationType {
    ORDER_CREATED,
    STOCK_ALLOCATED,
    STAGE_CHANGED,
    TASK_DISPATCHED,
    QC_VERIFIED,
    QC_FAILED,
    SHIPPED,
    DELIVERED
};

/**
 * @class IOrderObserver
 * @brief Observer Pattern Interface for decoupled event listener subscribers.
 */
class IOrderObserver {
public:
    virtual ~IOrderObserver() = default;
    virtual void onOrderEvent(const std::string& orderId, 
                              OrderEventNotificationType eventType, 
                              const std::string& message, 
                              const std::string& hubId) = 0;
};

/**
 * @class TelemetryLoggerObserver
 * @brief Concrete Observer implementation logging real-time system events to stdout.
 */
class TelemetryLoggerObserver : public IOrderObserver {
public:
    void onOrderEvent(const std::string& orderId, 
                      OrderEventNotificationType eventType, 
                      const std::string& message, 
                      const std::string& hubId) override;
};
