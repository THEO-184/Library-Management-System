const CustomApiError = require("./error");
const BadRequest = require("./bad-request");
const NotFound = require("./not-found");
const Unauthenticated = require("./authentication");
const UnauthorizedError = require("./unauthorized");
module.exports = {
	CustomApiError,
	BadRequest,
	NotFound,
	Unauthenticated,
	UnauthorizedError,
};
