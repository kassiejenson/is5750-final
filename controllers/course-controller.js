const Course = require("../models/course-model-mongoose");
const Trainer = require("../models/trainer-model-mongoose");
const User = require('../models/user-model-mongoose');
const path = require('path');


exports.getCourses = async (req, res) => {
  // Get all courses
  try {
    const courses = await Course.find().populate("trainer");
    let user;

    if (req.session.user) {
      user = await User.findById(req.session.user._id);
    }

    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses,
      user
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getCourseDetails = async (req, res) => {
  // Get single course
  const { courseSlug } = req.params;
  let user;

    if (req.session.user) {
      user = await User.findById(req.session.user._id);
    }
  try {
    const course = await Course.findOne({ slug: courseSlug }).populate("trainer")
    console.log('course that was fetched', course);
    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course,
      user,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getTopCoursesByLikes = async (limit) => {
  // get top courses for the home page
  try {
    const courses = await Course.find().populate("trainer").sort({ likes: -1 }).limit(limit)
    return courses;
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getCourseRegistration = async (req, res) => {
  const { courseSlug } = req.params;

  try {
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.redirect('/404');
    }

    const user = req.session.user;
    if (!user) {
      return res.redirect('/user/login')
    }
    console.log('user!!!', user._id);
    const courses = await Course.find();

    res.render('register', {
      pageTitle: 'Register for a Course',
      pageClass: "register-page",
      user,
      courses,
      course
    })
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
}

exports.postCourseRegistration = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.session.user._id;

  try {
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);
    const courses = await Course.find();

    if (course.registrants.length >= course.capacity) {
      return res.render('register', {
        pageTitle: 'Register for Course',
        pageClass: "register-page",
        course,
        courses,
        errorMessage: 'Course is full. Please check back later!'
      });
    }

    console.log('user courses before registration:', user.courses);
    console.log('course.registrants', course);

    if (user.courses.includes(course._id)) {
      return res.render('register', {
        pageTitle: 'Register for Course',
        pageClass: "register-page",
        course,
        courses,
        errorMessage: 'You are already registered!'
      })
    }

    course.registrants.push(userId);
    await course.save();

    user.courses.push(courseId);
    await user.save();
    req.flash('success', 'Success! You registered for the course.');
    res.redirect('/courses');
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}

exports.postCourseUnregistration = async (req, res) => {
  const { courseSlug } = req.params;
  const userId = req.session.user._id;

  try {
    const course = await Course.findOne({ slug: courseSlug });
    const user = await User.findById(userId);

    course.registrants.pull(userId);
    await course.save();

    user.courses.pull(course._id);
    await user.save();

    res.redirect('/courses')
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}

exports.getCreateCourseForm = async (req, res) => {
  const trainers = await Trainer.find();
  res.render("create-course", {
    pageTitle: "Create Course",
    pageClass: "course-page",
    trainers
  })
}


exports.postCreateCourse = async (req, res, next) => {
  let image_file;
  let uploadPath;
  console.log('file req', req);
  if (!req.files) {
    return res.status(400).send('no files uploaded');
  }

  image_file = req.files.image;
  console.log()
  try {
    console.log('req body', req.body);
    const { title, summary, description, price, capacity, trainerId, files } = req.body;
    const imageFile = image_file;

    uploadPath = path.join(__dirname, '..', 'public', 'assets', 'img', imageFile.name);
    await imageFile.mv(uploadPath);

    
    await Course.create({
      title,
      summary,
      description,
      price,
      capacity,
      trainer: trainerId,
      image: imageFile.name,
      schedule: 'TBD'
    })
    res.redirect('/courses')
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
}

exports.getEditCourse = async (req, res, next) => {
  const { courseSlug } = req.params;
  const trainers = await Trainer.find();
  const course = await Course.findOne({ slug: courseSlug }).populate("trainer")
  res.render("edit-course", {
    pageTitle: "Edit Course",
    pageClass: "edit-ourses-page",
    course,
    trainers
  });
}

exports.editCourse = async (req, res, next) => {
  const { courseSlug } = req.params;
  console.log('course slug', courseSlug)
  try {
    const course = await Course.findOne({ slug: courseSlug }).populate("trainer")
    console.log('course!', course);
    const { title, summary, description, price, capacity, trainerId } = req.body;
    course.title = title || course.title;
    course.summary = summary || course.summary;
    course.description = description || course.description;
    course.price = price || course.price;
    course.capacity = capacity || course.capacity;
    course.trainer = trainerId || course.trainer;
    let updatedImage = course.imageUrl;
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      uploadPath = path.join(__dirname, '..', 'public', 'assets', 'img', imageFile.name);
      await imageFile.mv(uploadPath);
      updatedImage = imageFile.name;
      course.image = updatedImage;
    }

    await course.save();

    res.redirect('/courses');
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}

exports.postDeleteCourse = async (req, res, next) => {
  console.log('deleting course');
  const { courseSlug } = req.params;
  try {
    const course = await Course.findOne({ slug: courseSlug }).populate("trainer");
    if (course) {
      const updateUsers = await User.updateMany(
        { courses: course._id },
        { $pull: { courses: course._id }}
      );
      console.log('updated users', updateUsers);
      await Course.findByIdAndDelete(course._id)
    }
    console.log('course deleted');
    res.redirect('/courses');
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
}