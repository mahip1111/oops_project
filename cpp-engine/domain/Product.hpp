#pragma once
#include <string>

/**
 * @class Product
 * @brief Represents a physical SKU / Catalog item with warehouse storage coordinates.
 * Demonstrates Object-Oriented Encapsulation.
 */
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
    Product(std::string pSku, std::string pName, std::string pCat, 
            double pPrice, double pWeight, std::string pAisle, std::string pShelf);

    // Getters
    std::string getSku() const;
    std::string getName() const;
    std::string getCategory() const;
    double getPrice() const;
    double getWeightKg() const;
    std::string getAisle() const;
    std::string getShelf() const;
};
