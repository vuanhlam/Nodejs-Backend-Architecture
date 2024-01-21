"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const { convertToObjectIdMongodb, getSelectData } = require("../utils");
const { findProduct } = require("./product.service.lvxxx");

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
      if (maxRightValue) {
        console.log('-------------- in -----------------');
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
        .select(
          getSelectData([
            "comment_left",
            "comment_right",
            "comment_content",
            "comment_parentId",
          ])
        )
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId,
    })
      .select(
        getSelectData([
          "comment_left",
          "comment_right",
          "comment_content",
          "comment_parentId",
        ])
      )
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  //delete comment
  static async deleteComment({ commentId, productId }) {
    // check the product exists in database
    const foundProduct = await findProduct({ product_id: productId });
    if(!foundProduct) throw new NotFoundError('product not found')

    // 1. xác định giá trị left và right của comment xóa
    const comment = await Comment.findById(commentId)
    if(!comment) throw new NotFoundError('comment not found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    //2. tính width
    const width = rightValue - leftValue + 1

    //3. xóa tất cả comment con
    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    //4. cập nhật giá trị left và right còn lại
    await Comment.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_right: { $gt: rightValue }
    }, {
      $inc: { comment_right: -width }
    })

    await Comment.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gt: rightValue }
    }, {
      $inc: { comment_left: -width }
    })

    return true

  }
}

module.exports = CommentService;
