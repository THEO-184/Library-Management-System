const { Unauthenticated } = require("../errors");
const User = require("../models/auth");

const librarianAuthMiddleware = async (req, res, next) => {
	const userEmail = req.userEmail;
	try {
		const user = await User.findOne({ email: userEmail });
		if (user.status !== "Librarian") {
			throw new Unauthenticated("user is not authorized to perform this task");
		}
		next();
	} catch (error) {
		throw new Unauthenticated("user is not authorized to perform this task");
	}
};

module.exports = librarianAuthMiddleware;
