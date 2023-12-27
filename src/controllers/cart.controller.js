const CartService = require("../services/cart.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class CartController {
  addToCart = async (req, res, next) => {
    new CREATED({
      message: "Create cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  // update + -
  update = async (req, res, next) => {
    new CREATED({
      message: "Create cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteItemInCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Deleted cart success",
      metadata: await CartService.deleteCartItem(req.body),
    }).send(res);
  };

  getlistUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
