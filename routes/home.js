const express = require("express");
const router = express.Router();

router.get("/greeting", (req, res) => {
  const { user } = req.session;
  if (req.session.user) {
    res.render("home", { name: user.username });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
