const express = require("express");
const router = express.Router();

const { changePassword, getBook } = require("../controllers/user");

router.route("/user/change_password").put(changePassword);
router.route("/books/:id").get(getBook);

module.exports = router;
