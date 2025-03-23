"use strict";

const { CREATED } = require("../core/success.response");
const CommentServie = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new CREATED({
      message: "Create comment successed!",
      metaData: await CommentServie.createComment({
        ...req.body,
      }),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    new CREATED({
      message: "Get comment by Parent successed!",
      metaData: await CommentServie.getCommentsByParentId(req.query),
    }).send(res);
  };

  deleteComments = async (req, res, next) => {
    new CREATED({
      message: "Delete comment successed!",
      metaData: await CommentServie.deleteComments(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
