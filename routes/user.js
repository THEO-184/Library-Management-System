const express = require("express");
const router = express.Router();

const { changePassword } = require("../controllers/user");

router.route("/change_password").put(changePassword);

module.exports = router;
