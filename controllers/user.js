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

const returnBook = async (req, res) => {
	const { bookID, userId } = req.body;
	const request = await Request.findOneAndUpdate(
		{ bookID, userId },
		{ isBookReturned: true, isAvailable: true, isRequested: false },
		{ new: true, runValidators: true }
	);

	if (!request) {
		throw new NotFound(`please check your provided user ID and book id well`);
	}

	const book = await Book.findOneAndUpdate(
		{ _id: bookID },
		{ isAvailable: true },
		{ new: true, runValidators: true }
	);

	if (!book) {
		throw new NotFound(`please check your provided user ID and book id well`);
	}

	res.status(StatusCodes.OK).json({ request, book });
};

const getRequestedBooks = async (req, res) => {
	// let lookUpObj = [
	// 	{
	// 		$match: {
	// 			isBookReturned: false,
	// 		},
	// 	},
	// 	{
	// 		$lookup: {
	// 			from: "books",
	// 			localField: "bookID",
	// 			foreignField: "_id",
	// 			as: "book_details",
	// 		},
	// 	},
	// ];
	// let newArr = await Request.aggregate(lookUpObj).sort("-createdAt");
	let newArr = await Request.find({
		userId: req.userDetails.userId,
	}).populate({ path: "bookID", select: "name author catalogueName" });

	// let requestBooks = newArr.map((item) => {
	// 	const { userId, isApproved, bookID, book_details, createdAt } = item;
	// 	const { name, author, catalogueName } = book_details[0];
	// 	return {
	// 		createdAt,
	// 		userId,
	// 		bookID,
	// 		isApproved,
	// 		details: { name, author, catalogueName },
	// 	};
	// });

	res.status(StatusCodes.OK).json({
		success: true,
		total: newArr.length,
		data: newArr,
	});
};

module.exports = { changePassword, requestBook, getRequestedBooks, returnBook };
