"use strict";

const { NotFoundError } = require("../core/error.response");
const cart = require("../models/cart.model");
const {
  createUserCart,
  updateCartQuantity,
  deleteUserCartItem,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

/**
 * Key features: Cart Service
 * - add product to cart [user]
 * - reduce product quantity by one [user]
 * - increase product quantity by one [user]
 * - get cart [user]
 * - delete cart [user]
 * - delete cart item
 */

class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart ton tai hay khong ?
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    // neu co gio hang roi nhung chua co sp ?
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // neu gio hang ton tai, va co sp nay roi ?
    return await updateCartQuantity({ userId, product });
  }

  // update cart
  /** Front-end request
   *   userId: "xxx"
   *   shop_order_ids: [
   *      {
   *        shopId,
   *        item_products: [
   *          {
   *            quantity,
   *            price,
   *            shopId,
   *            old_quantity,
   *            productId
   *          }
   *        ],
   *        version
   *     }
   *  ]
   */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError("Product not exist!");

    // compare shop
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError(`Product do not belong to the shop`);
    }

    if (quantity === 0) {
      // delete
    }

    return await updateCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    return await deleteUserCartItem({ userId, productId });
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean();
  }
}

module.exports = CartService;
