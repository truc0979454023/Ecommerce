"use strict";

const { BadRequestError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const commentSchema = require("../models/comment.model");
const {
  findOneProductForUser,
} = require("../models/respositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

/**
 * key features: Comment serivce
 * add comment [user, shop]
 * get a list of comments [user, shop]
 * delele a comment [user|shop|admin]
 */
//Nested Comments
class CommentServie {
  static async createComment(payload) {
    const { productId, userId, content, parentCommentId = null } = payload;

    const comment = new commentSchema({
      commentProductId: productId,
      commentUserId: userId,
      commentContent: content,
      commentParentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      //reply comment
      const parentCommentId = await commentSchema.findById(parentCommentId);
      if (!parentCommentId)
        throw new BadRequestError("Parent comment not found");
      else {
        rightValue = parentCommentId.commentRight;
        //update number comment
        await commentSchema.updateMany(
          {
            commentProductId: convertToObjectIdMongodb(productId),
            commentRight: { $gte: rightValue },
          },
          {
            $inc: { commentRight: 2 },
          }
        );

        await commentSchema.updateMany(
          {
            commentProductId: convertToObjectIdMongodb(productId),
            commentLeft: { $gte: rightValue },
          },
          {
            $inc: { commentLeft: 2 },
          }
        );
      }
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          commentProductId: convertToObjectIdMongodb(productId),
        },
        "commentRight",
        { sort: { commentRight: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.commentRight + 1;
      } else {
        rightValue = 1;
      }
    }

    //insert to Comment
    comment.commentLeft = rightValue;
    comment.commentRight = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId(payload) {
    const {
      productId,
      parentCommentId = null,
      limit = 50,
      offset = 0,
    } = payload;

    if (parentCommentId) {
      const parent = await commentSchema.find(
        convertToObjectIdMongodb(parentCommentId)
      );
      if (!parent) throw new BadRequestError("Not found comment for product");

      const comments = await commentSchema
        .find({
          commentProductId: convertToObjectIdMongodb(productId),
          commentLeft: { $gt: parent.commentLeft },
          commentRight: { $lte: parent.commentRight },
        })
        .select({
          commentLeft: 1,
          commentRight: 1,
          commentContent: 1,
          commentParentId: 1,
        })
        .sort({
          commentLeft: 1,
        });

      return comments;
    }
    const comments = await commentSchema
      .find({
        commentProductId: convertToObjectIdMongodb(productId),
        commentParentId: parentCommentId,
      })
      .select({
        commentLeft: 1,
        commentRight: 1,
        commentContent: 1,
        commentParentId: 1,
      })
      .sort({
        commentLeft: 1,
      });

    return comments;
  }

  static async deleteComments(payload) {
    const { commentId, productId } = payload;

    //check the product exist in database
    const foundProduct = await findOneProductForUser({ productId: productId });
    if (!foundProduct) throw new BadRequestError("Product not found");

    //1. Xac dinh gia tri left and right
    const comment = await commentSchema.findById(
      convertToObjectIdMongodb(commentId)
    );
    if (!comment) throw new BadRequestError("Comment not found");

    const leftValue = comment.commentLeft;
    const rightValue = comment.commentRight;

    //2. Tinh width
    const width = rightValue - leftValue + 1;

    //3. Xoa tat ca commentId con
    await commentSchema.deleteMany({
      commentProductId: convertToObjectIdMongodb(productId),
      commentContent: { $gte: leftValue, $lte: rightValue },
    });
    //4. Cap nhat gia tri left and right con lai
    await commentSchema.updateMany(
      {
        commentProductId: convertToObjectIdMongodb(productId),
        commentRight: { $gt: rightValue },
      },
      {
        $inc: { commentRight: -width },
      }
    );
    await commentSchema.updateMany(
      {
        commentProductId: convertToObjectIdMongodb(productId),
        commentLeft: { $gt: rightValue },
      },
      {
        $inc: { commentLeft: -width },
      }
    );
  }
}

module.exports = CommentServie;
