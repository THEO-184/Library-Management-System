const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, req, res, next) => {
	let customErr = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Sonething went wrong",
	};
	// handle when user fail to provide all required registeration info
	if (err.name === "ValidationError") {
		customErr.msg = Object.values(err.errors)
			.map((prop) => prop.message)
			.join(",");
		customErr.statusCode = StatusCodes.BAD_REQUEST;
	}

	// handle Duplicate emails
	if (err && err.code === 11000) {
		customErr.msg = `Duplicate value for ${Object.keys(
			err.keyValue
		)},please choose a different one`;
		customErr.statusCode = StatusCodes.CONFLICT;
	}
	return res.status(customErr.statusCode).send({ msg: customErr.msg });
};

module.exports = errorMiddleware;
