"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

// define Factory class to create product

class ProductFactory {
  /*
    type: 'Clothing'
    payload:  {}
  */

  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT //

  // QUERY //
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb", "product_shop"],
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id });
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
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

// define sub-class for different product type = clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new Clothing Error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new Product Error");

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove attr has null or undefined
    const objectParams = removeUndefinedObject(this);
    //2. check where need to be update child or parent
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for different product type = electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new Electronic Error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new Product Error");

    return newProduct;
  }
}

// define sub-class for different product type = funiture
class Funiture extends Product {
  async createProduct() {
    const newFuniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFuniture) throw new BadRequestError("create new Electronic Error");

    const newProduct = await super.createProduct(newFuniture._id);
    if (!newProduct) throw new BadRequestError("create new Product Error");

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Funiture);

module.exports = ProductFactory;
