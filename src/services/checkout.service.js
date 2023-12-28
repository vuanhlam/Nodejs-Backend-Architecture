"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  // {
  //     "cartId": "",
  //     "userId": "",
  //     "shop_order_id": [
  //         {
  //             "shopId": "",
  //             "shop_discounts": "",
  //             "item_products": [
  //                 {
  //                     "price": "",
  //                     "quantity": "",
  //                     "productId": ""
  //                 }
  //             ]
  //         },
  //         {
  //             "shopId": "",
  //             "shop_discounts": [
  //                 {
  //                     "shopId": "",
  //                     "discountId": "",
  //                     "codeId": ""
  //                 }
  //             ],
  //             "item_products": [
  //                 {
  //                     "price": "",
  //                     "quantity": "",
  //                     "productId": ""
  //                 }
  //             ]
  //         }
  //     ]
  // }
  static async checkoutReview({ cartId, userId, shop_order_list = [] }) {
    // check cartId ton tai hay khong
    const foundCart = await findCartById(cartId);
    if(!foundCart) throw new BadRequestError('Cart does not exist!');

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien discount
        totalCheckout: 0 // tong tien phai tra
    }

    const shop_order_list_new = []

    // tinh tong tien bill
    /**
     * 1 - check sản phẩm có hợp lệ với database không - test
     * 2 - tổng tiền đơn hàng của từng shop
     * 3 - tổng tiền đơn hàng của tất cả các shop
     * 4 - nếu shop_discount tồn tại > 0, check xem có hợp lệ hay không
     * 5 - tổng thanh toán cuối cùng
    */
    for (let i = 0; i < shop_order_list.length; i++) {
        const { shopId, shop_discounts = [], item_products = [] } = shop_order_list[i]; 
        //1.
        const checkProductServer = await checkProductByServer(item_products);
        console.log(`checkProductServer::`, checkProductServer);
        if(!checkProductServer[0]) throw new BadRequestError('order wrong!')

        //2. 
        const totalPriceProductItemOfAShop = checkProductServer.reduce((acc, product) => {
            return acc + (product.price * product.quantity);
        }, 0)

        //3. 
        checkout_order.totalPrice += totalPriceProductItemOfAShop

        const itemCheckout = {
            shopId,
            shop_discounts,
            priceBeforeDiscount: totalPriceProductItemOfAShop, // tiền trước khi giảm giá
            priceApplyDiscount: totalPriceProductItemOfAShop,
            item_products: checkProductServer
        }

        //4.
        if(shop_discounts.length > 0) {
            // giả sử chỉ có một discount
            // get amount discount
            const { totalPrice = 0, discount = 0 }  = await getDiscountAmount({ 
                code: shop_discounts[0].codeId,
                userId,
                shopId,
                products: checkProductServer    
            })

            // tổng discount giảm giá
            checkout_order.totalDiscount += discount
 
            // cập nhật tiền giảm giá cho từng product của shop
            if(discount > 0) {
                itemCheckout.priceApplyDiscount = totalPriceProductItemOfAShop - discount
            }
        }

        //6.
        checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
        shop_order_list_new.push(itemCheckout);
    }

    return {
        shop_order_list,
        shop_order_list_new,
        checkout_order
    }
  }
}

module.exports = CheckoutService;
