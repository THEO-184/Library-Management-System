const jwt = require("jsonwebtoken");

const { Unauthenticated } = require("../errors");

const authenticationMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new Unauthenticated("user is not authorized");
	}
	const token = authHeader.split(" ")[1];
	try {
		const decodedUser = jwt.verify(token, process.env.SECRET_KEY);
		req.userEmail = decodedUser.email;
		next();
	} catch (error) {
		throw new Unauthenticated("user is not authorized");
	}
};

module.exports = authenticationMiddleware;
