#pragma once
#include <string>
#include <vector>
#include <chrono>
#include "pipeline/Task.hpp"
#include "warehouse/Warehouse.hpp"
#include "core/OrderStateMachine.hpp"

/**
 * @enum OrderPriority
 * @brief Priority classification reflecting service level agreements (SLAs).
 */
enum class OrderPriority {
    STANDARD = 3,
    EXPRESS = 6,
    SAME_DAY = 9
};

/**
 * @struct OrderItem
 * @brief Individual line item within a customer order.
 */
struct OrderItem {
    std::string id;
    std::string name;
    std::string color;
    int quantity;
    double price;
    std::string aisle;
    std::string shelf;
    bool located;
};

/**
 * @class Order
 * @brief Represents a customer order entity orchestrating line items, fulfillment tasks, and state machine transitions.
 */
class Order {
private:
    std::string id;
    std::string customerName;
    std::string destinationCity;
    std::string deliveryAddress;
    OrderPriority priority;
    OrderStateMachine stateMachine;
    std::string assignedHub;
    std::vector<OrderItem> items;
    double totalAmount;
    int deadlineMinutes;
    std::chrono::system_clock::time_point createdAt;
    std::vector<FulfillmentTask> tasks;
    WarehouseEvaluationResult evaluationResult;
    bool isUnderManualReview;

public:
    Order(std::string orderId, std::string customer, std::string destCity, 
          OrderPriority prio, double total, int deadlineMins = 120);

    void addItem(const OrderItem& item);

    // State Machine Transitions
    bool advanceState(OrderStateEnum targetState, const std::string& reason = "");
    OrderStateEnum getCurrentState() const;
    std::string getCurrentStateString() const;

    // Task decomposition into DAG waves
    void generateFulfillmentTasks(const std::string& hub);

    // Quality Check Result Handler
    bool handleQCResult(bool passed, const std::string& notes = "");

    // Getters & Setters
    std::string getId() const;
    std::string getCustomerName() const;
    std::string getDestinationCity() const;
    OrderPriority getPriority() const;
    std::string getAssignedHub() const;
    void setAssignedHub(const std::string& hub);
    const std::vector<OrderItem>& getItems() const;
    double getTotal() const;
    int getDeadlineMinutes() const;
    std::vector<FulfillmentTask>& getTasks();
    const std::vector<FulfillmentTask>& getTasks() const;
    void setEvaluationResult(const WarehouseEvaluationResult& eval);
    const WarehouseEvaluationResult& getEvaluationResult() const;
    bool isManualReview() const;
    void setManualReview(bool review);
};
