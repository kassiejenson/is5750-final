const Event = require("../models/event-model-mongoose");
const path = require('path');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const formattedEvents = events.map((event) => ({
      ...event.toJSON(),
      formattedDate: new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    }));

    res.render("events", {
      pageTitle: "Events",
      pageClass: "events-page",
      events: formattedEvents,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err)
  }
};

exports.getEventCreate = async (req, res) => {
  res.render("create-event", {
    pageTitle: "Create Event",
    pageClass: "event-page"
  })
}

exports.postEventCreate = async (req, res) => {
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
    const { title, summary, date } = req.body;
    const imageFile = image_file;

    uploadPath = path.join(__dirname, '..', 'public', 'assets', 'img', imageFile.name);
    await imageFile.mv(uploadPath);

    //fix
    await Event.create({
      title,
      summary,
      image: imageFile.name,
      date
    })
    res.redirect('/events')
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
}
