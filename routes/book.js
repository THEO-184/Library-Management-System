const express = require("express");
const router = express.Router();

const {
	createBook,
	getEnglishBooks,
	getMathBooks,
	getHistoryBooks,
	getScienceBooks,
} = require("../controllers/books");

router.route("/english").get(getEnglishBooks);
router.route("/maths").get(getMathBooks);
router.route("/history").get(getHistoryBooks);
router.route("/science").get(getScienceBooks);

module.exports = router;
