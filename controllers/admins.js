const User = require("../models/user");
const Book = require("../models/book");
const RentedBook = require("../models/RentedBook");
const { StatusCodes } = require("http-status-codes");
const { NotFound, CustomApiError, BadRequest } = require("../errors");

const createLibrarian = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.createSignUpJWT();
	res
		.status(StatusCodes.CREATED)
		.json({ user: { email: user?.email, id: user?._id }, token });
};

const removeLibrariansOrUser = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOneAndDelete({ email });
	if (!user) {
		throw new NotFound(`No user with email ${email}`);
	}

	res
		.status(StatusCodes.CREATED)
		.json({ msg: `user with id ${email} successfully deleted` });
};

const createBook = async (req, res) => {
	const booksCollection = await Book.create(req.body);
	res.status(StatusCodes.CREATED).json({
		success: true,
		msg: `${booksCollection.length} successfully added to books catalogue`,
	});
};

const getBookCollection = async (req, res) => {
	const { collection } = req.query;
	const queryObj = { status: "rental" };
	if (collection) {
		queryObj.catalogueName = { $regex: `${collection}`, $options: "i" };
	}

	const bookCollection = await Book.find(queryObj).sort("catalogueName");
	if (!bookCollection) {
		throw new NotFound(
			`No collection in the library bears the name ${collection}`
		);
	}
	res.status(StatusCodes.OK).json({
		success: true,
		total: bookCollection.length,
		data: bookCollection,
	});
};

const getBook = async (req, res) => {
	const { id } = req.params;
	const book = await Book.findOne({ _id: id });
	if (!book) {
		throw new BadRequest(`No book with id ${id}`);
	}
	if (book.status === "unavailable") {
		return res
			.status(StatusCodes.OK)
			.json({ msg: `Book with id ${id} is currently unavailable` });
	}
	const { _id, name, author } = book;

	res
		.status(StatusCodes.OK)
		.json({ success: true, book: { _id, name, author } });
};

const deleteBookCollection = async (req, res) => {
	const { collection } = req.query;
	const deleteObj = {};
	if (collection) {
		deleteObj.catalogueName = { $regex: `${collection}`, $options: "i" };
	}
	const book = await Book.deleteMany(deleteObj);
	if (!book) {
		throw new NotFound(
			`No collection in the libarary bears the name ${collection}`
		);
	}
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
	if (!book) {
		throw new NotFound(`No book with id ${id} was found in the libarary`);
	}
	res
		.status(StatusCodes.OK)
		.json({ msg: `book with id ${id} successfully updated`, book });
};

const deleteBook = async (req, res) => {
	const { id } = req.params;
	const book = await Book.findOneAndDelete({ _id: id });
	if (!book) {
		throw new NotFound(`No book with id ${id} was found in the libarary`);
	}

	res
		.status(StatusCodes.OK)
		.json({ msg: `Book with Id ${id} successfully deletd`, book });
};

module.exports = {
	createLibrarian,
	removeLibrariansOrUser,
	getBook,
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	deleteBookCollection,
};
