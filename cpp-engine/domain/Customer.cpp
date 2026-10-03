#include "domain/Customer.hpp"

Customer::Customer(std::string cId, std::string cName, std::string cEmail,
                   std::string cAddr, std::string cCity, std::string cPhone)
    : id(cId), name(cName), email(cEmail), defaultAddress(cAddr), city(cCity), phone(cPhone) {}

std::string Customer::getId() const { return id; }
std::string Customer::getName() const { return name; }
std::string Customer::getEmail() const { return email; }
std::string Customer::getAddress() const { return defaultAddress; }
std::string Customer::getCity() const { return city; }
std::string Customer::getPhone() const { return phone; }
