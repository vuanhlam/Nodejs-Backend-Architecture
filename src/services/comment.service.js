"use strict";

const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb, getSelectData } = require("../utils");

/**
 * - key features: Comment service
 * + add comment [ User, Shop ]
 * + get a list of comments [ User, Shop ]
 * + delete a comment [ User, Shop, Admin ]
 */
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.comment_right;

      // update many comments
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      // chưa có parent
      // tìm right lớn nhất trong record + 1
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        {
          sort: { comment_right: -1 },
        }
      );
      console.log("max right value", maxRightValue);
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Parent comment not found");
      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      })
      .select(getSelectData(['comment_left', 'comment_right', 'comment_content', 'comment_parentId']))
      .sort({
        comment_left: 1
      });

      return comments
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId
    }) 
    .select(getSelectData(['comment_left', 'comment_right', 'comment_content', 'comment_parentId']))
    .sort({
      comment_left: 1
    });

    return comments
  }
}

module.exports = CommentService;
