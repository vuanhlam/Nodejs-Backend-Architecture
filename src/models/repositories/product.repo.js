"use strict";

const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");
const { Types } = require("mongoose");
const { getSelectData, convertToObjectIdMongodb } = require("../../utils");
const { NotFoundError } = require("../../core/error.response");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return queryProduct({ query, limit, skip });
};

// https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } } // tìm kiếm thì chỉ muốn giá trị đúng nhất sẽ có nhiệm vụ sắp xếp những cụm từ chính xác theo điểm số score
    )
    .sort({ score: { $meta: "textScore" } });
  return result;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const queryProduct = ({ query, limit, skip }) => {
  return product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id }) => {
  return await product.findById(product_id).select("-__v");
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const getProductById = async (productId) => {
  return await product.findOne({_id: convertToObjectIdMongodb(productId)}).lean();
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if(foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId
        }
      }
    }))
}

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
};
