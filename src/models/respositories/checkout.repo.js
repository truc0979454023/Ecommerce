const { convertToObjectIdMongodb } = require("../../utils");
const cartModel = require("../cart.model");

const findCartById = async ({ cartId }) => {
  return await cartModel
    .findOne({ _id: convertToObjectIdMongodb(cartId), cartState: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
