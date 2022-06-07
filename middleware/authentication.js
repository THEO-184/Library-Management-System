const jwt = require("jsonwebtoken");

const { Unauthenticated } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new Unauthenticated("user is not authenticated");
	}
	const token = authHeader.split(" ")[1];
	try {
		const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
		req.userDetails = {
			userEmail: decodedUser.email,
			userId: decodedUser.userId,
		};
		next();
	} catch (error) {
		throw new Unauthenticated("user is not authenticated");
	}
};

module.exports = authenticationMiddleware;
