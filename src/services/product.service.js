"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// define Factory class to create product

class ProductFactory {
  /*
    type: 'Clothing'
    payload:   
  */
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronic(payload).createElectronicProduct();
      case "Clothing":
        return await new Clothing(payload).createClothingProduct();
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`);
    }
  }
}

// define basic product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

// define sub-class for different product type = clothing
class Clothing extends Product {
  async createClothingProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing Error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product Error");

    return newProduct;
  }
}

// define sub-class for different product type = electronic
class Electronic extends Product {
  async createElectronicProduct() {
    const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop});
    if (!newElectronic)
      throw new BadRequestError("create new Electronic Error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product Error");

    return newProduct;
  }
}

module.exports = ProductFactory;
