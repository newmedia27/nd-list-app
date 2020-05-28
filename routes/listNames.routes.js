const { Router } = require("express");
const ListName = require("../models/ListName");
const List = require("../models/List");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");

const router = Router();

router.get("/list", auth, async (req, res) => {
  try {
    const list = await ListName.find({ shared: req.user.userId }).sort({
      created_at: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});
router.delete("/list/:id", auth, async (req, res) => {
  try {
    const deleteItem = await ListName.findByIdAndDelete(req.params.id);
    await List.deleteMany({ listName: req.params.id });

    const list = await ListName.find({ shared: req.user.userId }).sort({
      created_at: -1,
    });
    res.json({ list, message: `${deleteItem.name} has been deleted!` });
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.post("/list", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const listName = new ListName({
      name,
      author: req.user.userId,
      shared: req.user.userId,
    });
    await listName.save();
    res.status(201).json({ listName, message: `${name} has been created!` });
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.post(
  "/list/shared/:id",
  auth,
  [check("userPhone", "Phone has wrong").isMobilePhone("uk-UA")],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect input",
        });
      }

      const { userPhone } = req.body;
      const user = await User.findOne({ phone: userPhone });
      if (!user) {
        return res
          .status(404)
          .json({ message: "user with this number does not exist" });
      }
      const item = await ListName.findOne({ _id: req.params.id });

      const update = { shared: [...item.shared, user._id] };
      await item.updateOne(update);
      res.json({ message: "Updated!" });
    } catch (err) {
      res.status(500).json({ message: "Error on a server" });
    }
  }
);
router.get(
  "/list/shared/:id",
  auth,
  async (req, res) => {
    try {
      const item = await ListName.findOne({ _id: req.params.id });
      const users = await User.find({ _id: item.shared });
      const result = users.filter(e=>e.id!==req.user.userId).map((e) => ({ id: e.id, phone: e.phone }));
      res.json(result)
    } catch (err) {
      res.status(500).json({ message: "Error on a server" });
    }
  }
);

module.exports = router;
