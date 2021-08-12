/** @format */
const mongoose = require('mongoose');
const md5 = require('md5');
const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  Name: String,
  Year: Number,
  Actor: [{ type: String }],
  IMDB: Number,
  Link: String,
});
const movieModel = mongoose.model('AllMovie', userSchema);

exports.checkDuplicacy = (name) => {
  return movieModel.findOne({ Name: name });
};

exports.findYear = () => {
  return movieModel.aggregate([
    { $match: {} },
    { $group: { _id: '$Year' } },
    { $sort: { _id: -1 } },
  ]);
};
exports.findYearAllMovie = (year) => {
  return movieModel.find({ Year: year }).sort({ Name: 'asc' });
};
exports.findMovieOfaParticularYear = (Year, Name) => {
  return movieModel.find({ Year, Name });
};

