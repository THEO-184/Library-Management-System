const Book = require("../models/book");
const User = require("../models/auth");
const { StatusCodes } = require("http-status-codes");
const { Unauthenticated } = require("../errors");

const createBook = async (req, res) => {
	const booksCollection = await Book.create(req.body);
	res.status(StatusCodes.CREATED).json({
		success: true,
		total: booksCollection.length,
		data: booksCollection,
	});
};

const getBookCollection = async (req, res) => {
	const { name } = req.query;
	const queryObj = {};
	if (name) {
		queryObj.catalogueName = { $regex: `${name}`, $options: "i" };
	}

	const bookCollection = await Book.find(queryObj);
	res.status(StatusCodes.OK).json({
		success: true,
		total: bookCollection.length,
		data: bookCollection,
	});
};

const updateBook = async (req, res) => {
	const {
		params: { id },
		body: { status, catalogueName },
	} = req;

	const updateOb = {};

	if (status) {
		updateOb.status = status;
	}
	if (catalogueName) {
		updateOb.catalogueName = catalogueName;
	}

	const book = await Book.findOneAndUpdate({ _id: id }, updateOb, {
		new: true,
		runValidators: true,
	});
	res
		.status(StatusCodes.OK)
		.json({ msg: `book with id ${id} successfully updated`, book });
};
const deleteBook = async (req, res) => {
	const { id } = req.params;
	res.send(id);
};

module.exports = {
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
};
