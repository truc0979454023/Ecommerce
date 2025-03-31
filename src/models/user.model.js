"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "User";

const UserSchema = new Schema(
  {
    userId: { type: Number, required: true },
    userSlug: { type: String, required: true },
    userName: { type: String, default: "" },
    userPassword: { type: String, default: "" },
    userSalf: { type: String, default: "" },
    userEmail: { type: String, required: true },
    userPhone: { type: String, default: "" },
    userSex: { type: String, default: "" },
    userAvatar: { type: String, default: "" },
    userDateOfBirth: { type: Date, default: null },
    userRole: { type: Schema.Types.ObjectId, ref: "Role" },
    userStatus: {
      type: String,
      enum: ["pending", "active", "block"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, UserSchema);
