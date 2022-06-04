require("dotenv").config();
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

	// status: {
	// 	type: String,
	// 	required: [true, "please provide your status"],
	// 	enum: ["liberian", "user"],
	// 	message: "${VALUE} is not supported",
	// 	default: "user",
	// },
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

// generate token for each user instance

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ userId: this._id, name: this.email },
		process.env.SECRET_KEY,
		{ expiresIn: "30d" }
	);
};

// confirm password
UserSchema.methods.confirmPassword = async function (inputPswd) {
	const isMatched = await bcrypt.compare(inputPswd, this.password);
	return isMatched;
};
module.exports = model("User", UserSchema);
