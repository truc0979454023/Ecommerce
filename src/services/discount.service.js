const { BadRequestError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findOneDiscount,
  findOneAndUpdateDiscount,
  findAllDiscountsUnselect,
  deleteDiscount,
} = require("../models/respositories/discount.repo");
const {
  convertToObjectIdMongodb,
  removeUndefindedAndNullObject,
} = require("../utils");
const { findAllProductsForUser } = require("./product.service");

class DiscountService {
  static createDiscountCode = async (payload) => {
    const {
      discountName,
      discountDescription,
      discountType,
      discountValue,
      discountCode,
      discountStartDate,
      discountEndDate,
      discountMaxUses,
      discountUsersUsed,
      discountUserUsedCount,
      discountMaxUsesPerUser,
      discountMinOrderValue,
      discountShopId,
      discountIsActive,
      discountAppliesTo,
      discountProductIds,
    } = payload;

    // if (
    //   new Date() < new Date(discountStartDate) ||
    //   new Date() > new Date(discountEndDate)
    // ) {
    //   throw new BadRequestError("Discount code has expried!");
    // }

    if (new Date(discountStartDate) >= new Date(discountEndDate)) {
      throw new BadRequestError("Start date must be before End date");
    }

    //create index for discount code
    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (foundDiscountCode && foundDiscountCode.discountIsActive) {
      throw new BadRequestError("Discount alreadly exists!");
    }

    if (
      discountType === "percentage" &&
      (0 > discountValue || discountValue > 100)
    ) {
      throw new BadRequestError("Discount value must be between from 0 to 100");
    }

    const newDiscount = await discountModel.create({
      discountName,
      discountDescription,
      discountType,
      discountValue,
      discountCode,
      discountStartDate: new Date(discountStartDate),
      discountEndDate: new Date(discountAppliesTo),
      discountMaxUses,
      discountUsersUsed,
      discountUserUsedCount,
      discountMaxUsesPerUser,
      discountMinOrderValue: discountMinOrderValue || 0,
      discountShopId,
      discountIsActive,
      discountAppliesTo,
      discountProductIds: discountAppliesTo === "all" ? [] : discountProductIds,
    });

    return newDiscount;
  };

  static updateDiscountCode = async (discountId, payload) => {
    const { discountCode, discountStartDate, discountEndDate, discountShopId } =
      payload;

    // if (
    //   new Date() < new Date(discountStartDate) ||
    //   new Date() > new Date(discountEndDate)
    // ) {
    //   throw new BadRequestError("Discount code has expried!");
    // }

    if (new Date(discountStartDate) >= new Date(discountEndDate)) {
      throw new BadRequestError("Start date must be before End date");
    }

    if (
      discountType === "percentage" &&
      (0 > discountValue || discountValue > 100)
    ) {
      throw new BadRequestError("Discount value must be between from 0 to 100");
    }

    //create index for discount code
    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (!foundDiscountCode) {
      throw new BadRequestError("Discount not exists!");
    }

    //update discount
    const bodyUpdate = removeUndefindedAndNullObject(payload);
    const updateDiscount = await findOneAndUpdateDiscount({
      discountId,
      bodyUpdate,
    });
    if (!updateDiscount) {
      throw new BadRequestError("Discount not found");
    }
    return updateDiscount;
  };

  //get all discount codes avaliable with products
  static async getAllDiscountCodeWithProductForUser(payload) {
    const {
      discountCode,
      discountShopId,
      limit = 50,
      sort = "ctime",
      page = 1,
      select = ["productName"],
    } = payload;

    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (foundDiscountCode && foundDiscountCode.discountIsActive) {
      throw new BadRequestError("Discount alreadly exists!");
    }
    const { discountAppliesTo, discountProductIds } = foundDiscountCode;

    let products;
    if (discountAppliesTo === "all") {
      products = await findAllProductsForUser({
        filter: {
          //get all product has discount by shopId
          productShop: convertToObjectIdMongodb(discountShopId),
          isPublic: true,
        },
        limit: limit,
        page: page,
        sort: sort,
        select: select,
      });
    }
    if (discountAppliesTo === "specific") {
      products = await findAllProductsForUser({
        filter: {
          //get all product has discount by productId
          _id: { $in: discountProductIds },
          isPublic: true,
        },
        limit: limit,
        page: page,
        sort: sort,
        select: select,
      });
    }
    return products;
  }

  //get all discount codes avaliable with products
  static async getAllDiscountCodeWithProductForShop(payload) {
    const { limit, page, shopId } = payload;
    const discounts = await findAllDiscountsUnselect({
      limit: limit,
      sort: "ctime",
      page: page,
      filter: {
        discountShopId: convertToObjectIdMongodb(shopId),
        discountIsActive: true,
      },
      unSelect: ["__v", "discountShopId"],
    });

    return discounts;
  }

  //apply discount for pruduct of user
  static async getDiscountAmount(payload) {
    const { discountCode, discountShopId, products, userId } = payload;

    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (!foundDiscountCode) {
      throw new BadRequestError("Discount not exists!");
    }

    const {
      _id,
      discountIsActive,
      discountMaxUses,
      discountEndDate,
      discountStartDate,
      discountMinOrderValue,
      discountMaxUsesPerUser,
      discountUsersUsed,
      discountType,
      discountValue,
    } = foundDiscountCode;

    if (!discountIsActive) throw new BadRequestError("Discount expried!");
    if (!discountMaxUses) throw new BadRequestError("Discount are out!");
    if (
      new Date() < new Date(discountStartDate) ||
      new Date() > new Date(discountEndDate)
    ) {
      throw new BadRequestError("Discount expried!");
    }
    //check discountMinOrderValue has set value
    let totalOrder;
    if (discountMinOrderValue > 0) {
      totalOrder = products.reduce(
        (acc, product) => acc + product.productQuantity * product.productPrice,
        0
      );

      if (totalOrder < discountMinOrderValue) {
        throw new BadRequestError(
          `Discount requires a min order value of ${discountMinOrderValue}`
        );
      }
    }

    if (discountMaxUsesPerUser > 0) {
      const userUsedDiscountCount = discountUsersUsed.reduce(
        (count, user) => (user.userId === userId ? (count += 1) : count),
        0
      );
      if (userUsedDiscountCount > discountMaxUsesPerUser) {
        throw new BadRequestError("User has used up add discount code!");
      }

      //update discount discountUsersUsed, discountUserUsedCount,discountProductIds
      // const bodyUpdate = {
      //   discountUsersUsed: [...discountUsersUsed, userId],
      //   discountUserUsedCount: discountUserUsedCount + 1,
      //   discountProductIds: [
      //     ...discountProductIds,
      //     ...products.map((product) => convertToObjectIdMongodb(product._id)),
      //   ],
      // };
      const bodyUpdate = {
        $push: {
          discountUsersUsed: products.map((product) =>
            convertToObjectIdMongodb(product._id)
          ),
          discountProductIds: convertToObjectIdMongodb(product._id),
        },
        $inc: {
          discountMaxUses: -1,
          discountUserUsedCount: 1,
        },
      };
      await findOneAndUpdateDiscount({
        discountId: _id,
        bodyUpdate,
      });
    }

    //check xem discount này là fixed_amount
    const amount =
      discountType === "fixed_amount"
        ? discountValue
        : totalOrder * (discountValue / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: total - amount,
    };
  }

  //Làm cách khác là khi xóa chuyển các dữ liệu xóa sang 1 schema khác
  //hoặc là tại 1 cờ isDeleted trong schema rồi cap nhat co len khi xoa
  static async deleteDiscountCode(payload) {
    const { discountCode, discountShopId } = payload;

    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (!foundDiscountCode) {
      throw new BadRequestError("Discount not exists!");
    }

    const deletedDiscount = await deleteDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    return deletedDiscount;
  }

  static async cancelDiscountCode(payload) {
    const { discountCode, discountShopId, userId } = payload;

    const foundDiscountCode = await findOneDiscount({
      discountCode,
      discountShopId: convertToObjectIdMongodb(discountShopId),
    });

    if (!foundDiscountCode) {
      throw new BadRequestError("Discount not exists!");
    }
    const bodyUpdate = {
      $pull: {
        discountUsersUsed: userId,
      },
      $inc: {
        discountMaxUses: 1,
        discountUserUsedCount: -1,
      },
    };
    const result = findOneAndUpdateDiscount({
      discountId: foundDiscountCode._id,
      bodyUpdate,
    });

    return result;
  }
}

module.exports = DiscountService;
