"user strict";

const { AuthFailureError } = require("../core/error.response");
const rbac = require("./role.middleware");

/**
 *
 * @param {string} action //read,delete or update
 * @param {*} resource  //profile,balance
 */

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const roleName = req.query.role;
      const permissions = rbac.can(roleName)[action](resource);
      if (!permissions.granted) {
        throw new AuthFailureError("You dont have Permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = grantAccess;
