"use strict";

const { BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const { product } = require("../models/product.model");
const { findCartById } = require("../models/respositories/checkout.repo");
const {
  checkProductByServer,
} = require("../models/respositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /**
     {
        cartId,
        userId,
        shopOrderIds:[
            {
                shopId,
                shopDiscount:[],
                itemProducts:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]       
            }
        ]
     }
     */

  static checkoutReview = async (payload) => {
    const { cartId, userId, shopOrderIds } = payload;

    //check cartId exist
    const foundCart = await findCartById({ cartId });

    if (!foundCart) throw new BadRequestError("Cart does not exist!");

    const checkoutOrder = {
      totalPrice: 0, // tong tien hang,
      feeShip: 0, // tong phi ship
      totalDiscount: 0, // tong tien discount giam gia
      totalCheckout: 0, // tong tien thanh toan
    };
    const shopOrderIdsNew = [];

    //tinh tong tien bill

    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderIds[i];
      //check product avalidable
      const checkProductServer = await checkProductByServer({ itemProducts });
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");

      //tong tien don hang
      const checkoutPrice = checkProductServer.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );

      //tong tien truoc khi xu ly
      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProductServer,
      };

      // neu shop discount ton tai > 0 check xem co hop le hay khong
      if (shopDiscounts.length > 0) {
        //gia su chi co 1 discount
        //get amount discount
        const { discount = 0 } = await getDiscountAmount({
          codeId: shopDiscounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        //tong discount giam gia >0
        checkoutOrder.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //tong tien thanh toan cuoi cung
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemCheckout);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkoutOrder,
    };
  };

  //order
  static orderByUser = async (payload) => {
    const {
      shopOrderIds,
      cartId,
      userId,
      userAddress = {},
      userPayment = {},
    } = payload;

    const { shopOrderIdsNew, checkoutOrder } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shopOrderIds,
      });

    //check lai 1 lan nua xem vuot ton kho hay khong
    // get new array product
    const products = shopOrderIdsNew.flatMap((order) => order.itemProducts);
    const acquireProduct = [];
    for (let i = 0; i < array.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    //kiểm tra nếu có 1 sản phẩm hết hàng trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Một số sản phầm đã được cập nhập, vui lòng quay lại giỏ hàng"
      );
    }

    const newOrder = await orderModel.create({
      orderUserId: userId,
      orderCheckout: checkoutOrder,
      orderShipping: userAddress,
      orderPayment: userPayment,
      orderProducts: shopOrderIdsNew,
    });
    //nếu insert thành công thì remove product có trong giỏ hàng
    if (newOrder) {
      //remove product in my cart
    }
    return newOrder;
  };

  // Query Orders Users
  static async getOrdersByUsers() {}
  // Query Order using Id users
  static async getOneOrdersByUsers() {}
  // Cancel Order Users
  static async cancelOrdersByUsers() {}
  // Update Orders Status By Shop|Admin
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
