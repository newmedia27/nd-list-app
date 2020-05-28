const { model, Schema, Types } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  finished: { type: Boolean, required: true, default: false },
  author: { type: Types.ObjectId, ref: "User" },
  listGroup: [{ type: Types.ObjectId, ref: "List" }],
  shared: [{ type: Types.ObjectId, ref: "User" }],
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = model("ListName", schema);
