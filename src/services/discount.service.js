"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discount = require("../models/discount.model");
const {
  updateDiscountById,
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  convertToObjectIdMongodb,
  removeUndefinedObject,
  updateNestedObjectParser,
} = require("../utils");

/**
 * Discount Services
 * 1 - Generator Discount Code [Shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User | Shop]
 * 4 - Verify discount code [User]
 * 5 - Delete discount Code [Admin | Shop]
 * 6 - Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      value,
      users_userd,
    } = payload;
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expried");
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError("Start date must be before end date");
    }

    const foundDiscount = await checkDiscountExists({ code, shopId });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exist!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_max_value: max_value,
      discount_start_date: start_date,
      discount_end_date: new Date(end_date),
      discount_max_uses: new Date(max_uses),
      discount_used_count: uses_count,
      discount_users_used: users_userd,
      discount_max_use_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to === "all" ? [] : product_ids,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(discountId, shopId, body) {
    const removedNullBody = removeUndefinedObject(body);
    const payload = updateNestedObjectParser(removedNullBody);
    const updateProduct = await updateDiscountById({
      discountId,
      shopId,
      payload,
    });
    return updateProduct;
  }

  /**
   * Get all discount codes available with products - user
   */
  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = checkDiscountExists({ code, shopId });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /**
   * Get all discount codes of shop
   */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  /**
   * Apply Discount Code
   * product = [
   *    {
   *        productId,
   *        shopId,
   *        quantity,
   *        name,
   *        price
   *    },
   *    {
   *        productId,
   *        shopId,
   *        quantity,
   *        name,
   *        price
   *    }
   * ]
   */
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({ code, shopId });

    if (!foundDiscount) throw new NotFoundError(`Discount code not exist!`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_users_used,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_max_use_per_user,
      discount_type,
      discount_value
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError(`Discount expired!`);
    if (discount_users_used > discount_max_uses)
      throw new NotFoundError(`Discount are out`);
    if (
      new Date() < new Date(discount_start_date) ||
      new Date(discount_end_date)
    ) {
      throw new NotFoundError(`Discount code has expired!`);
    }

    // check xem co set gia tri toi thieu hay khong
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total of the cart
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if(totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minimun order value of ${discount_min_order_value}`)
      }
    }

    if(discount_max_use_per_user > 0) {
        const userDiscount = discount_users_used.find((user) => user.userId === userId);
        if(userDiscount) {
            throw new NotFoundError(`Discount was used!`)
        }
    }

    // check xem discount nay la fixed_amount hay percentage
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100); 

    return {
        totalOrder,
        discount: amount,
        totalPrice: totalOrder - amount
    }
  }
}

module.exports = DiscountService;
