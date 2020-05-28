const { model, Schema, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  list: [{ type: Types.ObjectId, ref: "ListName" }],
  created_at: { type: Date, required: true, default: Date.now},
});

module.exports = model("User", schema);
