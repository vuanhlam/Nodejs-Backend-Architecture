const { unGetSelectData, convertToObjectIdMongodb } = require("../../utils");
const cart = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cart
    .findOneAndUpdate(query, updateOrInsert, options)
    .select(unGetSelectData(["__v"]));
};

const updateCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateSet, options);
};

const deleteUserCartItem = async ({ userId, productId }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const update = { $pull: { cart_products: { productId } } };

  const deteleCart = await cart.updateOne(query, update);
  return deteleCart;
};

const findCartById = async (cartId) => {
  return await cart.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: "active" }).lean();
};

module.exports = {
  createUserCart,
  updateCartQuantity,
  deleteUserCartItem,
  findCartById,
};
