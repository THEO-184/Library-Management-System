console.clear();
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
// local imporrs
const userRouter = require("./routes/user");
const connectDB = require("./db/connect");
// middleware imports
const notFoundMiddleware = require("./middleware/custom-error");
const errorMiddleware = require("./middleware/custom-error");

app.use(express.json());

app.use("/api/v1/users", userRouter);
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
