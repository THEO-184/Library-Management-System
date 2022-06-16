const User = require("../models/user");
const { BadRequest, NotFound, Unauthenticated } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { createJWT, attacheCookieParser } = require("../utils/jwt");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const tokenPayload = { email: user?.email, status: user?.status };
	attacheCookieParser({ tokenPayload });
	res
		.status(StatusCodes.CREATED)
		.json({ user: { email: user?.email, id: user?._id } });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequest("please provide all user credentials");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new Unauthenticated(`user not authenticated`);
	}
	const isPasswordMathced = await user.confirmPassword(password);
	if (!isPasswordMathced) {
		throw new Unauthenticated(`user not authenticated`);
	}
	const tokenPayload = {
		email: user?.email,
		status: user?.status,
		userId: user?._id,
	};
	attacheCookieParser({ res, tokenPayload });
	res
		.status(StatusCodes.OK)
		.json({ user: { email: user?.email, id: user?._id } });
};

const logout = async (req, res) => {
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.send("logout");
};

module.exports = { register, login, logout };
