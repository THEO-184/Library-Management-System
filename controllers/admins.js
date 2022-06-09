const User = require("../models/user");
const Book = require("../models/book");
const Request = require("../models/request");
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
	const { id } = req.params;
	const user = await User.findOneAndDelete({ _id: id });
	if (!user) {
		throw new NotFound(`No user with id ${id}`);
	}

	res
		.status(StatusCodes.CREATED)
		.json({ msg: `user with id ${id} successfully deleted` });
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
	const queryObj = { isAvailable: true };
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
		body: { status, assignedTo },
	} = req;

	const updateOb = {};

	if (status) {
		updateOb.status = status;
	}
	if (assignedTo) {
		updateOb.assignedTo = assignedTo;
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

const getAllBookRequests = async (req, res) => {
	const requestedBooks = await Request.find({
		isRequested: true,
		isBookReturned: false,
	}).sort("-createdAt");
	res.status(StatusCodes.OK).json({
		success: true,
		total: requestedBooks.length,
		data: requestedBooks,
	});
};

const approveOrDisapproveBook = async (req, res) => {
	const {
		params: { id },
		body: { isApproved, isBookReturned, isAvailable, isRequested, bookID },
	} = req;

	const updateObj = {};

	if (isApproved) {
		updateObj.isApproved = isApproved;
	}
	if (isBookReturned) {
		updateObj.isBookReturned = isBookReturned;
	}
	if (isAvailable) {
		updateObj.isAvailable = isAvailable;
	}
	if (isRequested) {
		updateObj.isRequested = isRequested;
	}
	const requestedBook = await Request.findOneAndUpdate({ _id: id }, updateObj, {
		new: true,
		runValidators: true,
	});

	if (!requestedBook) {
		throw new NotFound(`please check your provided user ID and book id well`);
	}

	const updateBookCollection = await Book.findOneAndUpdate(
		{ _id: bookID },
		{ isAvailable: isApproved ? false : true },
		{ new: true, runValidators: true }
	);

	if (!updateBookCollection) {
		throw new NotFound(`please check your provided user ID and book id well`);
	}

	res.status(StatusCodes.OK).json({
		success: true,
		data: requestedBook,
		updateBookCollection,
	});
};

const updateAllBooks = async (req, res) => {
	const { isAvailable } = req.body;

	const books = await Book.updateMany({}, { isAvailable });

	res.status(StatusCodes.OK).json({ books });
};

module.exports = {
	createLibrarian,
	removeLibrariansOrUser,
	getAllBookRequests,
	createBook,
	updateBook,
	deleteBook,
	getBookCollection,
	deleteBookCollection,
	approveOrDisapproveBook,
	updateAllBooks,
};
