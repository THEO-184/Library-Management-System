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
	status: {
		type: String,
		enum: {
			values: ["rental", "unavailable"],
			message: "{VALUE} is not supported",
			default: "rental",
		},
	},
	unique: true,
});
module.exports = model("Book", BookSchema);
