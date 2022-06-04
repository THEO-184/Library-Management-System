const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();

const {
	createLibrarian,
	removeLibrariansOrUser,
} = require("../controllers/admins");

router.route("/").post(createLibrarian);
router.route("/:id").delete(removeLibrariansOrUser);

module.exports = router;
