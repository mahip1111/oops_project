#include "core/OrderStateMachine.hpp"
#include <iostream>

std::string orderStateToString(OrderStateEnum state) {
    switch (state) {
        case OrderStateEnum::CREATED: return "CREATED";
        case OrderStateEnum::CONFIRMED: return "CONFIRMED";
        case OrderStateEnum::ALLOCATED: return "ALLOCATED";
        case OrderStateEnum::PICKING: return "PICKING";
        case OrderStateEnum::PACKING: return "PACKING";
        case OrderStateEnum::QUALITY_CHECK: return "QUALITY_CHECK";
        case OrderStateEnum::SHIPPED: return "SHIPPED";
        case OrderStateEnum::DELIVERED: return "DELIVERED";
        case OrderStateEnum::REPROCESSING: return "REPROCESSING";
        default: return "UNKNOWN";
    }
}

OrderStateMachine::OrderStateMachine() : currentState(OrderStateEnum::CREATED) {
    transitionHistory.push_back({"Order initiated by customer", OrderStateEnum::CREATED});
}

OrderStateEnum OrderStateMachine::getCurrentState() const {
    return currentState;
}

std::string OrderStateMachine::getCurrentStateString() const {
    return orderStateToString(currentState);
}

bool OrderStateMachine::canTransitionTo(OrderStateEnum targetState) const {
    switch (currentState) {
        case OrderStateEnum::CREATED:
            return targetState == OrderStateEnum::CONFIRMED;
        case OrderStateEnum::CONFIRMED:
            return targetState == OrderStateEnum::ALLOCATED;
        case OrderStateEnum::ALLOCATED:
            return targetState == OrderStateEnum::PICKING;
        case OrderStateEnum::PICKING:
            return targetState == OrderStateEnum::PACKING;
        case OrderStateEnum::PACKING:
            return targetState == OrderStateEnum::QUALITY_CHECK;
        case OrderStateEnum::QUALITY_CHECK:
            return targetState == OrderStateEnum::SHIPPED || targetState == OrderStateEnum::REPROCESSING;
        case OrderStateEnum::REPROCESSING:
            return targetState == OrderStateEnum::PICKING;
        case OrderStateEnum::SHIPPED:
            return targetState == OrderStateEnum::DELIVERED;
        case OrderStateEnum::DELIVERED:
            return false; // Terminal state!
        default:
            return false;
    }
}

bool OrderStateMachine::transitionTo(OrderStateEnum targetState, const std::string& reason) {
    if (!canTransitionTo(targetState)) {
        std::cerr << "[STATE ERROR] Invalid transition from " << orderStateToString(currentState)
                  << " to " << orderStateToString(targetState) << " (Transition rejected by State Machine)" << std::endl;
        return false;
    }

    currentState = targetState;
    std::string histReason = reason.empty() ? ("Transitioned to " + orderStateToString(targetState)) : reason;
    transitionHistory.push_back({histReason, targetState});
    return true;
}

const std::vector<std::pair<std::string, OrderStateEnum>>& OrderStateMachine::getHistory() const {
    return transitionHistory;
}
