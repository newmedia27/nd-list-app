const { model, Schema, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  count: { type: Number, required: true, default: 1 },
  cost: { type: Number, default: 0.00 },
  total: { type: Number, default: 0.00 },
  finished: { type: Boolean, required: true, default: false },
  listName: { type: Types.ObjectId, ref: "ListName" },
  author: { type: Types.ObjectId, ref: "User" },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = model("List", schema);
