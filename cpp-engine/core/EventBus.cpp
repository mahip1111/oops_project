#include "core/EventBus.hpp"
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>

std::string EventBus::getCurrentTimeFormatted() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::localtime(&in_time_t), "%H:%M:%S");
    return ss.str();
}

void EventBus::publish(const std::string& orderId, 
                       const std::string& eventName, 
                       const std::string& details, 
                       const std::string& node) {
    std::string timeStr = getCurrentTimeFormatted();
    EventPacket packet{timeStr, eventName, orderId, details, node};
    logs.push_back(packet);
    std::cout << "[" << timeStr << "] [EVENT_BUS] (" << orderId << ") " 
              << eventName << " -> " << details << " (" << node << ")" << std::endl;
}

const std::vector<EventPacket>& EventBus::getLogs() const {
    return logs;
}
