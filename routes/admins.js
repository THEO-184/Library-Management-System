const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();

const {
	createLibrarian,
	removeLibrariansOrUser,
	getBook,
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	deleteBookCollection,
} = require("../controllers/admins");

router.route("/").post(createLibrarian);
router.route("/:email").delete(removeLibrariansOrUser);
router
	.route("/books")
	.post(createBook)
	.get(getBookCollection)
	.delete(deleteBookCollection);
router.route("/books/:id").put(updateBook).delete(deleteBook).get(getBook);

module.exports = router;
