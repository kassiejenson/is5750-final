const Contact = require("../models/contact-model-mongoose");

exports.getContact = (req, res, next) => {
  res.render("contact", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.getThanks = (req, res, next) => {
  res.render("thanks", {
    pageTitle: "Contact Us",
    pageClass: "contact-page",
  });
};

exports.postContact = async (req, res, next) => {

  try {
    const response = await Contact.create({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      postDate: new Date(),
    });
    res.redirect("/contacts/thanks");
  } catch (err) {
    console.log(err);
    //redirect with specific error message instead of generic 404/500 page
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
      errorMessage: "An error occurred, please try again.",
      formData: req.body,
    });
  }
};

exports.getContactsWithNoResponse = async (req, res, next) => {
  try {
    const contacts = await Contact.find({response: null})
    res.locals.contacts = contacts;
    next();
  } catch (error) {
    error.statusCode = 500;
    next(err);
  }
}

exports.loadContact = async (req, res, next) => {
  try {
    const { contactId } = req.body;
    const contact = await Contact.findById(contactId);
    res.locals.selectedContact = contact;
    next();
  } catch (error) {
    error.statusCode = 500;
    next(err);
  }
}

exports.postContactResponse = async (req, res, next) => {
  const { id, response } = req.body;
  try {
    const result = await Contact.findByIdAndUpdate(id, {$set: {response: response, responseDate: new Date()}}, {new: true})
    console.log('result of post update', result);
    res.redirect('/contacts/respond')
  } catch (error) {
    error.statusCode = 500;
    next(err);
  }
}

exports.renderContactResponse = async (req, res) => {
  console.log('rendering contact list');
  res.render('contact-list', { pageTitle: "Contact List", pageClass: "contact-response-page"})
}
