const { Unauthenticated, UnauthorizedError } = require("../errors");
const User = require("../models/user");

const librarianAuthMiddleware = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.userDetails.status)) {
			throw new UnauthorizedError(
				"user not authorized to access this resource"
			);
		}
		next();
	};
};

module.exports = librarianAuthMiddleware;
