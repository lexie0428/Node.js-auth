const express = require("express");
const bcrypt = require("bcrypt");
const { sessionChecker } = require("../middleware/auth");
const User = require("../models/user");
const saltRounds = 7;
const router = express.Router();

router.get("/", sessionChecker, (req, res) => {
  res.redirect("/login");
});

router
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.render("signup");
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds),
      });
      await user.save();
      req.session.user = user;
      res.redirect("/greeting");
    } catch (error) {
      if (error.errmsg.includes("duplicate")) {
        res.render("signup", {
          error: true,
          message: "Such user already exists",
        });
      }
      next(error);
    }
  });

router
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/greeting");
    } else {
      if (!user) {
        res.render("login", { error: true, message: "There is no such user" });
      }
      res.render("login", { error: true, message: "Incorrect password" });
    }
  });

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy();
      res.clearCookie("user_sid");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
