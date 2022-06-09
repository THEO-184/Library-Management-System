const express = require("express");
const router = express.Router();

const {
	updateAllBooks,
	createLibrarian,
	removeLibrariansOrUser,
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	getAllBookRequests,
	deleteBookCollection,
	approveOrDisapproveBook,
} = require("../controllers/admins");

router.route("/").post(createLibrarian).delete(removeLibrariansOrUser);
router
	.route("/books")
	.post(createBook)
	.get(getBookCollection)
	.delete(deleteBookCollection)
	.put(updateAllBooks);
router.route("/books/:id").put(updateBook).delete(deleteBook);
router.route("/books/requests").get(getAllBookRequests);
router.route("/books/requests/:id").put(approveOrDisapproveBook);

module.exports = router;
