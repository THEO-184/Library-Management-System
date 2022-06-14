const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, process.env.SECRET_KEY, {
		expiresIn: "1000s",
	});
	return token;
};

const attacheCookieParser = ({ res, tokenPayload }) => {
	const token = createJWT({ payload: tokenPayload });
	const oneDay = 1000 * 60 * 60 * 24;
	res.cookie("token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		signed: true,
		secured: process.env.NODE_ENV === "production",
	});
};

module.exports = { createJWT, attacheCookieParser };
