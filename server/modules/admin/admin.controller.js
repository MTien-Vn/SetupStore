const Order = require("../user/order");
const User = require("../user/user");

//orders, orderStatus

exports.getAllOrders = async (req, res) => {
  let orders = await Order.find({})
  .populate("products.product")
  .populate("orderedBy", "_id name picture area address")
  .sort([["createdAt", "desc"]])
  .exec();

  res.json(orders);
};


