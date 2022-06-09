require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
// const logger = require("morgan");
// local imporrs
const authRouter = require("./routes/auth");
const adminsRouter = require("./routes/admins");
const userRouter = require("./routes/user");
const connectDB = require("./db/connect");

// middleware imports
const notFoundMiddleware = require("./middleware/custom-error");
const errorMiddleware = require("./middleware/custom-error");
const authMiddleware = require("./middleware/authentication");
const librarianAuthMiddleware = require("./middleware/adminAuthMiddleware");

// extra security packages
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	})
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", authMiddleware, librarianAuthMiddleware, adminsRouter);
app.use("/api/v1/user", authMiddleware, userRouter);
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
