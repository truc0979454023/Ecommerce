// permisstion/admin service
"use strict";

const ResourceSchema = require("../models/resource.model");
const RoleSchema = require("../models/role.model");

class RbacSerivce {
  /**
   * new resource
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   */
  static createResource = async (payload) => {
    try {
      const { name = "profile", slug = "p00001", description = "" } = payload;

      const resource = await ResourceSchema.create({
        resourceName: name,
        resourceSlug: slug,
        resourceDescription: description,
      });

      return resource;
    } catch (error) {
      return error;
    }
  };

  static getListResource = async (payload) => {
    const {
      userId = 0, //admin
      limit = 50,
      offset = 0,
      search = "",
    } = payload;
    try {
      //1. check admin ? middleware function

      //2. getList of resource

      const resources = await ResourceSchema.aggregate([
        {
          $project: {
            _id: 0,
            name: "$resourceName",
            slug: "$resourceSlug",
            description: "$resourceDescription",
            resourceId: "$_id",
            createdAt: 1,
          },
        },
      ]);

      return resources;
    } catch (error) {
      return error;
    }
  };

  static createRole = async (payload) => {
    const {
      name = "shop",
      slug = "s00001",
      description = "",
      grants = [],
    } = payload;
    try {
      //1. Check role exist

      //2. new role
      const role = await RoleSchema.create({
        roleName: name,
        roleSlug: slug,
        roleDescription: description,
        roleGrants: grants,
      });

      return role;
    } catch (error) {
      return error;
    }
  };

  static getListRole = async (payload) => {
    const {
      userId = 0, //admin
      limit = 50,
      offset = 0,
      search = "",
    } = payload;
    try {
      //1. Check user admin

      //2. get list
      const roles = await RoleSchema.aggregate([
        {
          $unwind: "$roleGrants", // tách record theo roleGrants list
        },
        {
          $lookup: {
            from: "Resources",
            localField: "roleGrants.resourceId",
            foreignField: "_id",
            as: "resourceId",
          },
        },
        {
          $unwind: "$resourceId",
        },
        {
          $project: {
            role: "$roleName",
            resource: "$resourceId.resourceName",
            action: "$roleGrants.actions",
            attributes: "$roleGrants.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            role: 1,
            resource: 1,
            action: "$action",
            attributes: 1,
          },
        },
      ]);

      return roles;
    } catch (error) {}
  };
}

module.exports = RbacSerivce;
