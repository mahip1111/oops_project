#include "observer/NotificationManager.hpp"

void NotificationManager::attach(std::shared_ptr<IOrderObserver> observer) {
    if (observer) {
        observers.push_back(observer);
    }
}

void NotificationManager::notify(const std::string& orderId, 
                                 OrderEventNotificationType eventType, 
                                 const std::string& message, 
                                 const std::string& hubId) {
    for (auto& obs : observers) {
        if (obs) {
            obs->onOrderEvent(orderId, eventType, message, hubId);
        }
    }
}
