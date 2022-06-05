const bcryptjs = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { BadRequest, CustomApiError, NotFound } = require("../errors");
const User = require("../models/user");

const changePassword = async (req, res) => {
	const {
		body: { old_password, new_password },
		userEmail: email,
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

module.exports = { changePassword };
