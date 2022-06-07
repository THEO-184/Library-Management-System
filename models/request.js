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
});

module.exports = model("Request", requestsSchema);
