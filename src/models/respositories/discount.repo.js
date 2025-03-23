"use strict";

const { getUnselectData } = require("../../utils");
const discountModel = require("../discount.model");

const findOneDiscount = async ({ discountCode, discountShopId }) => {
  return await discountModel
    .findOne({
      discountCode: discountCode,
      discountShopId: discountShopId,
    })
    .lean();
};

const findOneAndUpdateDiscount = async ({ discountId, bodyUpdate }) => {
  return discountModel
    .findByIdAndUpdate(discountId, bodyUpdate, {
      isNew: true,
    })
    .lean();
};

const findAddDiscountsSelect = async ({
  limit,
  sort,
  page,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return discounts;
};

const findAllDiscountsUnselect = async ({
  limit,
  sort,
  page,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unSelect))
    .lean();

  return discounts;
};

const deleteDiscount = async ({ discountCode, discountShopId }) => {
  return await discountModel.findOneAndDelete({ discountCode, discountShopId });
};

module.exports = {
  findOneDiscount,
  findOneAndUpdateDiscount,
  findAddDiscountsSelect,
  findAllDiscountsUnselect,
  deleteDiscount,
};
