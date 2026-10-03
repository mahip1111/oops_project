#pragma once
#include <string>
#include <vector>
#include <memory>
#include "observer/Observer.hpp"

/**
 * @class NotificationManager
 * @brief Concrete Subject for the Observer Pattern in QuickFlow logistics engine.
 */
class NotificationManager {
private:
    std::vector<std::shared_ptr<IOrderObserver>> observers;

public:
    NotificationManager() = default;

    void attach(std::shared_ptr<IOrderObserver> observer);
    void notify(const std::string& orderId, 
                OrderEventNotificationType eventType, 
                const std::string& message, 
                const std::string& hubId = "BOM-04");
};
