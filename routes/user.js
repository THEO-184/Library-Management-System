const express = require("express");
const router = express.Router();

const {
	changePassword,
	requestBook,
	getRequestedBooks,
} = require("../controllers/user");

router.route("/user/change_password").put(changePassword);
router.route("/user/request").post(requestBook);
router.route("/user/books").get(getRequestedBooks);

module.exports = router;
