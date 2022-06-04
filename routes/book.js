const express = require("express");
const router = express.Router();

const {
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
} = require("../controllers/books");
router.route("/").post(createBook).get(getBookCollection);
router.route("/:id").put(updateBook).delete(deleteBook);

module.exports = router;
