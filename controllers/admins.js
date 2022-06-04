const User = require("../models/auth");
const { StatusCodes } = require("http-status-codes");
const { NotFound, CustomApiError } = require("../errors");

const createLibrarian = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.createSignUpJWT();
	res
		.status(StatusCodes.CREATED)
		.json({ user: { email: user?.email, id: user?._id }, token });
};

const removeLibrariansOrUser = async (req, res) => {
	const { id } = req.params;
	const user = await User.findOneAndDelete({ _id: id });
	if (!user) {
		throw new NotFound(`No user with id ${id}`);
	}

	res
		.status(StatusCodes.CREATED)
		.json({ msg: `user with id ${id} successfully deleted` });
};

module.exports = { createLibrarian, removeLibrariansOrUser };
