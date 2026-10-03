#include "domain/Product.hpp"

Product::Product(std::string pSku, std::string pName, std::string pCat, 
                 double pPrice, double pWeight, std::string pAisle, std::string pShelf)
    : sku(pSku), name(pName), category(pCat), price(pPrice), 
      weightKg(pWeight), defaultAisle(pAisle), defaultShelf(pShelf) {}

std::string Product::getSku() const { return sku; }
std::string Product::getName() const { return name; }
std::string Product::getCategory() const { return category; }
double Product::getPrice() const { return price; }
double Product::getWeightKg() const { return weightKg; }
std::string Product::getAisle() const { return defaultAisle; }
std::string Product::getShelf() const { return defaultShelf; }
