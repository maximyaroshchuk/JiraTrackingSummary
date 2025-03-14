const express = require("express");
const authenticateToken = require("../middlewares/token");
const generalRoutes = require('./generalRoutes');

const router = express.Router();

router.use(authenticateToken);

router.use('/', generalRoutes);

module.exports = router;