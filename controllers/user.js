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
		data: {
			...requestedBook,
		},
	});
};

const getRequestedBooks = async (req, res) => {
	let lookUpObj = [
		{
			$lookup: {
				from: "books",
				localField: "bookID",
				foreignField: "_id",
				as: "book_details",
			},
		},
	];
	let newArr = await Request.aggregate(lookUpObj);

	let requestBooks = newArr.map((item) => {
		const { userId, isApproved, bookID, book_details } = item;
		const { name, author, catalogueName } = book_details[0];
		return {
			userId,
			bookID,
			isApproved,
			details: { name, author, catalogueName },
		};
	});

	res.status(StatusCodes.OK).json({
		success: true,
		total: requestBooks.length,
		data: requestBooks,
	});
};

module.exports = { changePassword, requestBook, getRequestedBooks };
