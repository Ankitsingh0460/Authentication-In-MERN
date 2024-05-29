const express = require("express");
const router = express.Router();
const { handlesignup, handlesignin } = require("../controller/user")



router.post("/", handlesignup)
router.post("/login", handlesignin)



module.exports = router;