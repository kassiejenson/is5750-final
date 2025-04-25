const Trainer = require("../models/trainer-model-mongoose");

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();
    res.render("trainers", {
      pageTitle: "Trainers",
      pageClass: "trainers-page",
      trainers,
    });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

exports.getTopTrainersById = async (limit) => {
  try {
    const trainers = await Trainer.find().sort({ _id: 1 }).limit(limit);
    return trainers;
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};
