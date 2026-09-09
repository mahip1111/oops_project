#pragma once
#include <string>

class Product {
private:
    std::string sku;
    std::string name;
    std::string category;
    double price;
    double weightKg;
    std::string defaultAisle;
    std::string defaultShelf;

public:
    Product(std::string pSku, std::string pName, std::string pCat, double pPrice, double pWeight, std::string pAisle, std::string pShelf)
        : sku(pSku), name(pName), category(pCat), price(pPrice), weightKg(pWeight), defaultAisle(pAisle), defaultShelf(pShelf) {}

    std::string getSku() const { return sku; }
    std::string getName() const { return name; }
    std::string getCategory() const { return category; }
    double getPrice() const { return price; }
    double getWeightKg() const { return weightKg; }
    std::string getAisle() const { return defaultAisle; }
    std::string getShelf() const { return defaultShelf; }
};
