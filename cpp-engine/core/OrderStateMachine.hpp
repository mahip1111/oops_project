#pragma once
#include <string>
#include <vector>
#include <utility>

/**
 * @enum OrderStateEnum
 * @brief Discrete lifecycle states for an order.
 */
enum class OrderStateEnum {
    CREATED = 0,
    CONFIRMED = 1,
    ALLOCATED = 2,
    PICKING = 3,
    PACKING = 4,
    QUALITY_CHECK = 5,
    SHIPPED = 6,
    DELIVERED = 7,
    REPROCESSING = 8 // When QC fails
};

std::string orderStateToString(OrderStateEnum state);

/**
 * @class OrderStateMachine
 * @brief State Pattern implementation enforcing strict valid transitions and lifecycle invariant protection.
 */
class OrderStateMachine {
private:
    OrderStateEnum currentState;
    std::vector<std::pair<std::string, OrderStateEnum>> transitionHistory;

public:
    OrderStateMachine();

    OrderStateEnum getCurrentState() const;
    std::string getCurrentStateString() const;
    bool canTransitionTo(OrderStateEnum targetState) const;
    bool transitionTo(OrderStateEnum targetState, const std::string& reason = "");
    const std::vector<std::pair<std::string, OrderStateEnum>>& getHistory() const;
};
