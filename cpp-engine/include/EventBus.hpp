#pragma once
#include <string>
#include <vector>
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>

struct EventPacket {
    std::string timestamp;
    std::string eventName;
    std::string orderId;
    std::string details;
    std::string originNode;
};

class EventBus {
private:
    std::vector<EventPacket> logs;

    std::string getCurrentTimeFormatted() {
        auto now = std::chrono::system_clock::now();
        auto in_time_t = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::localtime(&in_time_t), "%H:%M:%S");
        return ss.str();
    }

public:
    void publish(const std::string& orderId, const std::string& eventName, const std::string& details, const std::string& node = "BOM-04") {
        std::string timeStr = getCurrentTimeFormatted();
        EventPacket packet{timeStr, eventName, orderId, details, node};
        logs.push_back(packet);
        std::cout << "[" << timeStr << "] [EVENT_BUS] (" << orderId << ") " << eventName << " -> " << details << " (" << node << ")" << std::endl;
    }

    const std::vector<EventPacket>& getLogs() const {
        return logs;
    }
};
