"use strict";
const { unGetSelectData } = require("../../utils");
const discount = require("../discount.model");

const updateDiscountById = async ({ discountId, shopId, payload }) => {
  return await discount.findByIdAndUpdate(
    { _id: discountId, discount_shopId: shopId },
    payload,
    {
      new: true,
    }
  );
};

const findDiscount = async ({ code, shopId }) => {
  return await discount
    .findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
    .lean();
};

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return documents;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean();

  return documents;
};

module.exports = {
  updateDiscountById,
  findDiscount,
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect
};
