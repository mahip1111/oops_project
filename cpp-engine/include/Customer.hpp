#pragma once
#include <string>

class Customer {
private:
    std::string id;
    std::string name;
    std::string email;
    std::string defaultAddress;
    std::string city;
    std::string phone;

public:
    Customer(std::string cId = "CUST-101", std::string cName = "Devon Lane", std::string cEmail = "devon@quickflow.io",
             std::string cAddr = "Plot 412, Infocity Road, Patia", std::string cCity = "Bhubaneswar", std::string cPhone = "+91 98765-43210")
        : id(cId), name(cName), email(cEmail), defaultAddress(cAddr), city(cCity), phone(cPhone) {}

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
    std::string getAddress() const { return defaultAddress; }
    std::string getCity() const { return city; }
    std::string getPhone() const { return phone; }
};
