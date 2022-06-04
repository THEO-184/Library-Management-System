const express = require("express");
const router = express.Router();

const {
	createBook,
	getEnglishBooks,
	getMathBooks,
	getHistoryBooks,
	getScienceBooks,
} = require("../controllers/books");
const librarianAuthMiddleware = require("../middleware/adminAuthMiddleware");

router.route("/").post(librarianAuthMiddleware, createBook);
router.route("/english").get(getEnglishBooks);
router.route("/maths").get(getMathBooks);
router.route("/history").get(getHistoryBooks);
router.route("/science").get(getScienceBooks);

module.exports = router;
