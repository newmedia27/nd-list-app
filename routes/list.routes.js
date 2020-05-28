const { Router } = require("express");
const List = require("../models/List");
const auth = require("../middleware/auth.middleware");

const router = Router();

router.get("/:id", auth, async (req, res) => {
  try {
    const list = await List.find({ listName: req.params.id }).sort({
      created_at: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, description, count, cost, listName } = req.body;
    let total = 0;
    if (parseInt(count) && parseFloat(cost)) {
      total = count * cost;
    }
    const list = new List({
      name,
      description,
      count,
      cost,
      total,
      listName,
      author: req.user.userId,
    });
    await list.save();
    res.status(201).json({ list, message: `${name} has been created!` });
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  const { finished, listNameId } = req.body;
  try {
    await List.findByIdAndUpdate(req.params.id, {
      finished,
    });
    const list = await List.find({ listName: listNameId }).sort({
      created_at: -1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const listItem = await List.findByIdAndUpdate(req.params.id, req.body);
    res.json(listItem);
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleteItem = await List.findByIdAndDelete(req.params.id);
    const list = await List.find({ listName: req.query.listNameId }).sort({
      created_at: -1,
    });
    res.json({ list, message: `${deleteItem.name} has been deleted!` });
  } catch (err) {
    res.status(500).json({ message: "Error on a server" });
  }
});

module.exports = router;
