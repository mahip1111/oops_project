#pragma once
#include <string>
#include <vector>
#include <memory>
#include <iostream>

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

// Observer Pattern Interface (PRD Section 5)
class IOrderObserver {
public:
    virtual ~IOrderObserver() = default;
    virtual void onOrderEvent(const std::string& orderId, OrderEventNotificationType eventType, const std::string& message, const std::string& hubId) = 0;
};

// Concrete Notification Manager Subject
class NotificationManager {
private:
    std::vector<std::shared_ptr<IOrderObserver>> observers;

public:
    void attach(std::shared_ptr<IOrderObserver> observer) {
        observers.push_back(observer);
    }

    void notify(const std::string& orderId, OrderEventNotificationType eventType, const std::string& message, const std::string& hubId = "BOM-04") {
        for (auto& obs : observers) {
            if (obs) {
                obs->onOrderEvent(orderId, eventType, message, hubId);
            }
        }
    }
};

// Concrete Observer for Telemetry Logging
class TelemetryLoggerObserver : public IOrderObserver {
public:
    void onOrderEvent(const std::string& orderId, OrderEventNotificationType eventType, const std::string& message, const std::string& hubId) override {
        std::cout << "[OBSERVER_NOTIFICATION] [" << hubId << "] (" << orderId << ") -> " << message << std::endl;
    }
};
