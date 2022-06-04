require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// local imporrs
const authRouter = require("./routes/user");
const bookRouter = require("./routes/book");
const adminsRouter = require("./routes/admins");
const connectDB = require("./db/connect");
// middleware imports
const notFoundMiddleware = require("./middleware/custom-error");
const errorMiddleware = require("./middleware/custom-error");
const authMiddleware = require("./middleware/authentication");
const librarianAuthMiddleware = require("./middleware/adminAuthMiddleware");
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", authMiddleware, librarianAuthMiddleware, bookRouter);
app.use(
	"/api/v1/admins",
	authMiddleware,
	librarianAuthMiddleware,
	adminsRouter
);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () => {
			console.log("server running on port 3000");
		});
	} catch (error) {
		throw new Error(error);
	}
};

start();
