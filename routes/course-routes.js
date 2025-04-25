const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");
const userController = require("../controllers/user-controller")

router.get("/create-course", userController.isAdmin, courseController.getCreateCourseForm);
router.get("/register/:courseSlug", courseController.getCourseRegistration)
router.get("/edit-course/:courseSlug", userController.isAdmin, courseController.getEditCourse);
router.get("/:courseSlug", courseController.getCourseDetails);
router.get("/", courseController.getCourses);


router.post("/register/:courseId", courseController.postCourseRegistration)
router.post("/unregister/:courseSlug", courseController.postCourseUnregistration)
router.post("/create-course", userController.isAdmin, courseController.postCreateCourse);
router.post("/edit-course/:courseSlug", userController.isAdmin, courseController.editCourse);
router.post('/delete-course/:courseSlug', userController.isAdmin, courseController.postDeleteCourse);

module.exports = router;
