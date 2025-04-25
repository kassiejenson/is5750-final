const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home-controller");
const apiController = require('../controllers/api-controller')

router.get("/about", homeController.getAbout);
router.get('/externalapi', homeController.getApi);
router.get('/api/token', apiController.getToken);
router.get('/api/courses', apiController.verifyToken, apiController.getCourses);
router.get("/", homeController.getHome);

module.exports = router;
