"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  findOneUserInCart,
  createUserInCart,
  updateUserCartQuantity,
  deleteUserCart,
  getListUserCart,
  deleteItemToCartUser,
} = require("../models/respositories/cart.repo");
const { getProductById } = require("../models/respositories/product.repo");

class CartService {
  static addToCart = async (payload) => {
    const { userId, product = {} } = payload;

    const foundUser = await findOneUserInCart({ userId });
    if (!foundUser) {
      return await createUserInCart({ userId, product });
    }

    if (foundUser.cartCountProduct?.length) {
      foundUser.cartProducts = [product];
      return await foundUser.save();
    }

    return await updateUserCartQuantity({ userId, product });
  };

  /* update cart
  shopOrderId:[
    {
        shopId,
        itemProducts:[
            {
                quantity,
                price,
                shopId,
                old_quantity,
                productId
            }    
        ],
        version
    }
  ]
  */
  static updateToCart = async (payload) => {
    const { userId, shopOrderIds } = payload;

    const { productId, quantity, oldQuantity } =
      shopOrderIds[0]?.itemProducts[0];

    const foundProduct = await getProductById({ productId });
    if (!foundProduct) {
      throw new BadRequestError("Product not exist!");
    }
    //so sanh
    if (foundProduct.productShop.toString() !== shopOrderIds[0]?.shopId) {
      throw new BadRequestError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      return deleteItemToCartUser({ userId, productId });
    }
    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  };

  static deleteItemToCartUser = async (payload) => {
    const { userId, productId } = payload;
    return await deleteItemToCartUser({ userId, productId });
  };

  static getListUserCart = async (payload) => {
    const { userId } = payload;
    return await getListUserCart({ userId });
  };
}

module.exports = CartService;
