#pragma once
#include <string>
#include <vector>

/**
 * @struct EventPacket
 * @brief Structured telemetry log packet captured by the EventBus.
 */
struct EventPacket {
    std::string timestamp;
    std::string eventName;
    std::string orderId;
    std::string details;
    std::string originNode;
};

/**
 * @class EventBus
 * @brief Pub-sub telemetry and event logging bus with timestamp generation.
 */
class EventBus {
private:
    std::vector<EventPacket> logs;

    static std::string getCurrentTimeFormatted();

public:
    EventBus() = default;

    void publish(const std::string& orderId, 
                 const std::string& eventName, 
                 const std::string& details, 
                 const std::string& node = "BOM-04");

    const std::vector<EventPacket>& getLogs() const;
};
