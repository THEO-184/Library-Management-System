// books schema
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const BookSchema = new Schema({
	name: {
		type: String,
		required: [true, "Please provide book name"],
		min: [3, "Book name should exceed 3 characters"],
		max: 30,
	},
	author: {
		type: String,
		required: [true, "Please provide author name"],
		min: [3, "author name should exceed 3 characters"],
		max: 30,
	},
	isAvailable: {
		type: Boolean,
		required: [true, "please provide book status"],
		default: true,
	},
	catalogueName: {
		type: String,
		enum: {
			values: ["Maths", "English", "Science", "History", "Tech", "French"],
			message: "{VALUE} is not supported",
			default: "Science",
		},
	},
});
module.exports = model("Book", BookSchema);
