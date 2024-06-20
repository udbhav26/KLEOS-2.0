const express = require("express");
const router = express.Router();

const {login} = require("../controllers/login");
const {signup} = require("../controllers/signup");
const {machineRegister} = require("../controllers/machineRegister");
const {dashboard} = require("../controllers/dashboard");

router.post("/login",login);
router.post("/signup",signup);
router.post("/machineRegister",machineRegister);
router.get("/dashboard",dashboard);

module.exports = router;