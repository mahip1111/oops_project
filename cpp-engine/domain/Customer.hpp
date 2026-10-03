#pragma once
#include <string>

/**
 * @class Customer
 * @brief Represents a customer entity in the QuickFlow logistics ecosystem.
 * Demonstrates Object-Oriented Encapsulation with private members and public accessors.
 */
class Customer {
private:
    std::string id;
    std::string name;
    std::string email;
    std::string defaultAddress;
    std::string city;
    std::string phone;

public:
    Customer(std::string cId = "CUST-101", 
             std::string cName = "Devon Lane", 
             std::string cEmail = "devon@quickflow.io",
             std::string cAddr = "Plot 412, Infocity Road, Patia", 
             std::string cCity = "Bhubaneswar", 
             std::string cPhone = "+91 98765-43210");

    // Getters
    std::string getId() const;
    std::string getName() const;
    std::string getEmail() const;
    std::string getAddress() const;
    std::string getCity() const;
    std::string getPhone() const;
};
