"use strict";

const DiscountService = require("../services/discount.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Create new Discount code success!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code found",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code found",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res); 
  };

  getAllProductsWithDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code found",
      metadata: await DiscountService.getAllProductsWithDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
