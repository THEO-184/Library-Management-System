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

const getBook = async (req, res) => {
	const {
		userDetails: { userEmail, userId },
		params: { id },
	} = req;

	const book = await Book.find({ _id: id });
	if (!book) {
		throw new BadRequest(`No book with id ${id}`);
	}

	if (book.status === "unavailable") {
		return res
			.status(StatusCodes.OK)
			.json({ msg: `Book with id ${id} is currently unavailable` });
	}

	const request = await Request.create({ userId, bookID: id });
	const { _id, name, author } = book;

	res
		.status(StatusCodes.OK)
		.json({ success: true, book: { _id, name, author } });
};

module.exports = { changePassword, getBook };
