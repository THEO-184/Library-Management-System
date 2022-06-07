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
	status: {
		type: String,
		required: [true, "please provide book status"],
		enum: {
			values: ["rental", "unavailable"],
			message: "{VALUE} is not supported",
			default: "rental",
		},
	},
	assignedTo: {
		type: String,
		trim: true,
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide email",
		],
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
