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

const getEnglishBooks = async (req, res) => {
	const englishBooks = await Book.find({ catalogueName: "English" });
	res.status(StatusCodes.OK).json({ success: true, data: englishBooks });
};
const getMathBooks = async (req, res) => {
	const mathsBook = await Book.find({ catalogueName: "Maths" });
	res
		.status(StatusCodes.OK)
		.json({ success: true, total: mathsBook.length, data: mathsBook });
};
const getHistoryBooks = async (req, res) => {
	const histroyBook = await Book.find({ catalogueName: "History" });
	res
		.status(StatusCodes.OK)
		.json({ success: true, total: histroyBook.length, data: histroyBook });
};
const getScienceBooks = async (req, res) => {
	const scienceBook = await Book.find({ catalogueName: "Science" });
	res
		.status(StatusCodes.OK)
		.json({ success: true, total: scienceBook.length, data: scienceBook });
};

module.exports = {
	createBook,
	getEnglishBooks,
	getMathBooks,
	getHistoryBooks,
	getScienceBooks,
};
