const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const User = require("../models/User");

const router = Router();

router.post(
  "/register",
  [
    check("email", "Email has wrong").isEmail(),
    check("password", "Password has wrong").isLength({ min: 6, max: 12 }),
    check("phone", "Phone has wrong").isMobilePhone("uk-UA"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect form",
        });
      }

      const { email, phone, password } = req.body;
      const userExec = await User.findOne({ email, phone });
      if (!userExec) {
        const cryptPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, phone, password: cryptPassword });
        await user.save();
        return res
          .status(201)
          .json({ message: "User Has been Created!", user });
      }
      return res
        .status(400)
        .json({ message: "This phone number and email are already exist" });
    } catch (err) {
      console.log(err, "ERROR");
      res.status(500).json({ message: "Error on authenticate" });
    }
  }
);

router.post(
  "/login",
  [
    check("phone", "Phone has wrong").isMobilePhone("uk-UA"),
    check("password", "Password has wrong").exists(),
  ],
  async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect form",
        });
      }

      const { phone, password } = req.body;
      const user = await User.findOne({phone});
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({ message: "Incorrect login or password" });
      }
      const token = jwt.sign(
        {
          userId: user.id,
          userEmail: user.email,
          userPhone: user.phone,
        },
        config.jwtSecretKey,
        { expiresIn: "24h" }
      );
      res.json({ token, userId: user.id });
    } catch (err) {
      res.status(500).json({ message: "Error on authenticate" });
    }
  }
);

module.exports = router;
