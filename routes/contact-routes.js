const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact-controller");
const userController = require('../controllers/user-controller')

router.get("/new", contactController.getContact);
router.post("/create", contactController.postContact);
router.get("/thanks", contactController.getThanks);

router.get('/respond', userController.isAdmin, contactController.getContactsWithNoResponse, contactController.renderContactResponse);
router.post('/load', userController.isAdmin, contactController.loadContact, contactController.getContactsWithNoResponse, contactController.renderContactResponse);
router.post('/respond', userController.isAdmin, contactController.postContactResponse, contactController.getContactsWithNoResponse, contactController.renderContactResponse)

module.exports = router;
