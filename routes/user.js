const express = require("express");
const router = express.Router();

const {
	changePassword,
	requestBook,
	getRequestedBooks,
	returnBook,
} = require("../controllers/user");

router.route("/user/change_password").put(changePassword);
router.route("/user/request").post(requestBook).put(returnBook);
router.route("/user/books").get(getRequestedBooks);

module.exports = router;
