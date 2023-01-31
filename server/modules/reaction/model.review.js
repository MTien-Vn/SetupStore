const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ReviewSchema = mongoose.Schema(
  {
    modelId: { type: ObjectId, refPath: "onModel" },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product"],
    },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
    rating: { type: Number, required: true },
    createdBy: { type: ObjectId, ref: "User" },
    comment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
