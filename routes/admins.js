const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();

const {
	createLibrarian,
	removeLibrariansOrUser,
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	getAllBookRequests,
	deleteBookCollection,
} = require("../controllers/admins");

router.route("/").post(createLibrarian).delete(removeLibrariansOrUser);
router
	.route("/books")
	.post(createBook)
	.get(getBookCollection)
	.delete(deleteBookCollection);
router.route("/books/:id").put(updateBook).delete(deleteBook);
router.route("/books/requests").get(getAllBookRequests);

module.exports = router;
