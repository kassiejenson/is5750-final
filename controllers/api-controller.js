const Course = require("../models/course-model-mongoose");
const jwt = require('jsonwebtoken');

exports.getCourses = async (req, res, next) => {
  // Get all courses
  try {
    const courses = await Course.find().populate("trainer").lean();
    const adjustedCourses = courses.map(course => {
        const {registrants, ...courseWithoutRegistrants } = course;
        return {
            ...courseWithoutRegistrants,
            imageUrl: `http://localhost:3000/img/${course.image}`
        }
    })
    console.log('courses', adjustedCourses);
    res.json(adjustedCourses);
  } catch (err) {
    console.log(err);
  }
};

exports.getToken = async (req, res, next) => {
    const token = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
        process.env.TOKEN_SECRET
      );
    
      res.status(200).json({
        message: "token generated",
        data: { token },
      });
}

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.query.token;
        try {
            jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            return res.status(404).json({error: 'invalid token'})
        }
        next();
      } catch (err) {
        console.error(err);

        res.status(500).json({
          message: `Error! ${err.message}`,
          error: err.message,
        });
    
        next(err);
      }
}