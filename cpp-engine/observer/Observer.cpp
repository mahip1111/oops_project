#include "observer/Observer.hpp"
#include <iostream>

void TelemetryLoggerObserver::onOrderEvent(const std::string& orderId, 
                                           OrderEventNotificationType eventType, 
                                           const std::string& message, 
                                           const std::string& hubId) {
    std::cout << "[OBSERVER_NOTIFICATION] [" << hubId << "] (" << orderId << ") -> " << message << std::endl;
}
