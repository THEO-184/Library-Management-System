const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
	email: {
		type: String,
		required: [true, "email required"],
		unique: true,
		trim: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide email",
		],
	},
	password: {
		type: String,
		required: [true, "password required"],
		min: [6, "password characters should be minimum 6 characters"],
	},
});

// middleware to generate alphanumeric password at every password input
UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = model("User", UserSchema);
