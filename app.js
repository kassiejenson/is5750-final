try {


// Import libraries
require('dotenv').config();
console.log('starting app.js');
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
console.log('before mongoose import');
const mongoose = require("mongoose");
console.log('after mongoose import');
const session = require('express-session');
console.log('after session');
const MongoDBStore = require('connect-mongodb-session')(session)
console.log('after mongodbstore');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
// Import Middleware
const requestLogger = require("./middleware");


console.log('starting app');

// Import Models
const Course = require("./models/course-model-mongoose");
const Trainer = require("./models/trainer-model-mongoose");

// Import Routes
const homeRoutes = require("./routes/home-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");

//import error controller
const errorController = require("./controllers/error-controller");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@is5750-cluster.qfb7m.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=IS5750-cluster`;
console.log('mongo url:', MONGODB_URI);

const app = express();

app.use(helmet());
app.use(compression());

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: true
    }
  })
)


// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Layout settings
app.use(expressLayouts);
app.set("layout", "layout");

app.use(flash());

app.use(fileUpload());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.user = req.session.user || {};
  res.locals.isAdmin = req.session.user?.roles.includes("admin");
  res.locals.flashMessages = req.flash();
  next();
})

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
// Serve static files from public directory
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
// );
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Use routes
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);
app.use("/contacts", contactRoutes);
app.use("/user", userRoutes);
app.use("/", homeRoutes);


app.use(errorController.get404);
app.use(errorController.get500);

console.log('going to connect to db');
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("mongoose connected!");

    
    
    //launch app
    console.log('launching app!');
    app.listen(process.env.PORT || 3000);
    console.log('app launched');
  })
  .catch((error) => {
    console.log(error);
  });
} catch (err) {
  //put this here due to errors with app
  //if it is having errors running, remove node_modules and reinstall
  console.log("error in try block!", err);
}