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
	const { collection } = req.query;
	const queryObj = {};
	if (collection) {
		queryObj.catalogueName = { $regex: `${collection}`, $options: "i" };
	}

	const bookCollection = await Book.find(queryObj);
	res.status(StatusCodes.OK).json({
		success: true,
		total: bookCollection.length,
		data: bookCollection,
	});
};

const deleteBookCollection = async (req, res) => {
	const { collection } = req.query;
	const deleteObj = {};
	if (collection) {
		deleteObj.catalogueName = { $regex: `${collection}`, $options: "i" };
	}
	const book = await Book.deleteMany(deleteObj);
	res.status(StatusCodes.OK).json({ book });
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
	const book = await Book.findOneAndDelete({ _id: id });
	res
		.status(StatusCodes.OK)
		.json({ msg: `Book with Id ${id} successfully deletd`, book });
};

module.exports = {
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	deleteBookCollection,
};
