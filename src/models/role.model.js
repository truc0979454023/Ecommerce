"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

const RoleSchema = new Schema(
  {
    roleName: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    roleSlug: { type: String, required: true },
    roleStatus: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    roleDescription: { type: String, default: "" },
    roleGrants: [
      {
        resourceId: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "*" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, RoleSchema);
