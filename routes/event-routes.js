const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event-controller");
const userController = require('../controllers/user-controller');

router.get('/create-event', userController.isAdmin, eventController.getEventCreate);
router.get("/", eventController.getEvents);
router.post('/create-event', userController.isAdmin, eventController.postEventCreate);

module.exports = router;
