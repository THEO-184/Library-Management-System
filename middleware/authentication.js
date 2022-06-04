const authenticationMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	console.log("authHeader", authHeader);
	next();
};

module.exports = authenticationMiddleware;
