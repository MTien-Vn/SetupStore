const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const WishlistSchema = mongoose.Schema(
  {
    modelId: { type: ObjectId, refPath: "onModel" },
    onModel: {
      required: true,
      type: String,
      enum: ["Combo", "Product"],
    },
    createdBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
