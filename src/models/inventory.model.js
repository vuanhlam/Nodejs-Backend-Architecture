const { Schema, Types, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

var inventorySchema = Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknown" },
    inven_stock: { type: Number, required: true }, // số lượng hàng tồn kho của sản phẩm,
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] }, // đặt hàng trước, khi add vào giỏ hàng thì lưu dữ liệu vào đây
    /**
     * - đặt hàng nghĩa là phải trừ đi hàng tồn kho
     * - khi nào thanh toán thì xóa cái đặt hàng trong này
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
