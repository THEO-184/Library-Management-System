const User = require("../models/user");
const { BadRequest, NotFound } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.createSignUpJWT();
	res
		.status(StatusCodes.CREATED)
		.json({ user: { email: user?.email, id: user?._id }, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequest("please provide all user credentials");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new NotFound(`user not found. Please check your credentials`);
	}
	const isPasswordMathced = await user.confirmPassword(password);
	if (!isPasswordMathced) {
		throw new NotFound(`user not found. Please check your credentials`);
	}
	const token = user.createLoginJWT();
	res
		.status(StatusCodes.OK)
		.json({ user: { email: user?.email, id: user?._id }, token });
};

module.exports = { register, login };
