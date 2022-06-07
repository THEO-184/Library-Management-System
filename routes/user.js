const express = require("express");
const router = express.Router();

const { changePassword, requestBook } = require("../controllers/user");

router.route("/user/change_password").put(changePassword);
router.route("/user/request").post(requestBook);

module.exports = router;
