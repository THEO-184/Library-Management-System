const jwt = require("jsonwebtoken");

const { UnauthorizedError, Unauthenticated } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
	try {
		const token = req.signedCookies.token;
		if (!token) {
			throw new Unauthenticated("user not authenticated");
		}
		const { email, status, userId } = jwt.verify(token, process.env.SECRET_KEY);
		req.userDetails = { userEmail: email, status, userId };
		next();
	} catch (error) {
		throw new Unauthenticated("user not authenticated");
	}
};

module.exports = authenticationMiddleware;
