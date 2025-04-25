const Course = require("../models/course-model-mongoose");
const Trainer = require("../models/trainer-model-mongoose");
const Event = require("../models/event-model-mongoose");
const Testimonial = require("../models/testimonial-model-mongoose");
const courseController = require("../controllers/course-controller");
const trainerController = require("../controllers/trainer-controller");
const axios = require('axios');

exports.getHome = async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const eventCount = await Event.countDocuments();
    const studentCount = 1232;
    const homeCourses = await courseController.getTopCoursesByLikes(3);
    const homeTrainers = await trainerController.getTopTrainersById(3);

    res.render("index", {
      pageTitle: "Home",
      pageClass: "index-page",
      aboutImage: "about.jpg",
      students: studentCount,
      courses: courseCount,
      events: eventCount,
      trainers: trainerCount,
      homeCourses: homeCourses,
      homeTrainers: homeTrainers,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getAbout = async (req, res) => {
  try {
    const courseCount = await Course.countDocuments();
    const trainerCount = await Trainer.countDocuments();
    const eventCount = await Event.countDocuments();
    const studentCount = 1232;

    const testimonials = await Testimonial.find();

    res.render("about", {
      pageTitle: "About",
      pageClass: "about-page",
      aboutImage: "about-2.jpg",
      students: studentCount,
      courses: courseCount,
      events: eventCount,
      trainers: trainerCount,
      testimonials: testimonials,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getApi = async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://weatherbit-v1-mashape.p.rapidapi.com/alerts',
    params: {
      lat: '41.7',
      lon: '-111.8'
    },
    headers: {
      'x-rapidapi-key': process.env.WEATHER_API_KEY,
      'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
  }
  try {
    const response = await axios.request(options);
    console.log('response', response.data);
    const alerts = response.data.alerts;

    let weatherAlert = "No weather alerts in Logan for now!"

    if (alerts.length !== 0) {
      let weatherAlert = alerts[0].description;
    } 

    res.render('external-api', {
      pageTitle: 'Weather Alerts',
      pageClass: 'weather-page',
      weatherAlert: weatherAlert
    })
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}
