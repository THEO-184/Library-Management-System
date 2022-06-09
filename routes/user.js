const express = require("express");
const router = express.Router();

const {
	changePassword,
	requestBook,
	getRequestedBooks,
	returnBook,
} = require("../controllers/user");

router.route("/change_password").put(changePassword);
router.route("/request").post(requestBook).put(returnBook);
router.route("/books").get(getRequestedBooks);

module.exports = router;
