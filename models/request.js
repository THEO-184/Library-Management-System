const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const requestsSchema = new Schema({
	bookID: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	isRequested: {
		type: Boolean,
		default: true,
	},
	isAvailable: {
		type: Boolean,
		default: false,
	},
	isApproved: {
		type: Boolean,
		default: false,
	},
	isBookReturned: {
		type: Boolean,
		default: false,
	},
});

module.exports = model("Request", requestsSchema);
