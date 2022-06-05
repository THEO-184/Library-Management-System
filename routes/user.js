const express = require("express");
const router = express.Router();

const { changePassword } = require("../controllers/user");
const { getBook } = require("../controllers/admins");

router.route("/user/change_password").put(changePassword);
router.route("/books/:id").get(getBook);

module.exports = router;
