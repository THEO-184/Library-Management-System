const CustomApiError = require("./error");
const BadRequest = require("./bad-request");
const NotFound = require("./not-found");
const Unauthenticated = require("./authentication");

module.exports = {
	CustomApiError,
	BadRequest,
	NotFound,
	Unauthenticated,
};
