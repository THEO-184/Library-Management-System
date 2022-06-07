const bcryptjs = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, CustomApiError, NotFound } = require("../errors");
const User = require("../models/user");
const Book = require("../models/book");
const Request = require("../models/request");

const changePassword = async (req, res) => {
	const {
		body: { old_password, new_password },
		userDetails: { userEmail: email },
	} = req;

	if (!old_password || !new_password) {
		throw new BadRequest("please provide all fields");
	}

	const user = await User.findOne({ email });
	const isPasswordMatch = await user.confirmPassword(old_password);
	if (!isPasswordMatch) {
		throw new NotFound("wrong password");
	}
	const password = await bcryptjs.hash(new_password, 10);
	const updateUser = await User.findOneAndUpdate(
		{ email },
		{ password },
		{ new: true, runValidators: true }
	);
	res.status(StatusCodes.OK).json({ success: true, updateUser });
};

const requestBook = async (req, res) => {
	const {
		userDetails: { userEmail, userId },
		body: { id },
	} = req;

	const book = await Book.findOne({ _id: id });
	if (!book) {
		throw new NotFound(
			`No Book with id ${id} was found in the books catalogue`
		);
	}

	const isBookAlreadyRequestedBySameUser = await Request.findOne({
		bookID: id,
		userId,
	});

	if (isBookAlreadyRequestedBySameUser) {
		return res
			.status(StatusCodes.OK)
			.json({ msg: `You already have a request placed for this book.` });
	}

	const request = await Request.create({ userId, bookID: id });

	const requestedBook = {
		title: book?.name,
		author: book?.author,
		category: book?.catalogueName,
	};

	res.status(StatusCodes.CREATED).json({
		success: true,
		msg: `request for book with id ${id} successful`,
		requestedBook,
	});
};

const getRequestedBooks = async (req, res) => {
	const { userEmail } = req.userDetails;
	const requests = await Request.find({ email: userEmail });
	res
		.status(StatusCodes.OK)
		.json({ success: true, total: requests.length, requests });
};

module.exports = { changePassword, requestBook, getRequestedBooks };
