/** @format */
const mongoose = require('mongoose');
const md5 = require('md5');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/Movie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  password: String,
});
const AdminModel = mongoose.model('Admin', userSchema);

exports.checkDuplicacy = (email) => {
  return AdminModel.findOne({ email });
};
exports.checkExistence = (email, password) => {
  return AdminModel.findOne({ email, password: md5(password) });
};

exports.create = (userInfo) => {
  userInfo.password = md5(userInfo.password);
  return AdminModel.create(userInfo);
};

exports.checkUser = (id) => {
  return AdminModel.findOne({ _id: id });
};

//checkExistMail
exports.checkMailId = (emailInfo) => {
  return AdminModel.findOne({ email: emailInfo });
};

//checkuserDetails for Reset password

exports.checkDetails = (_id, email) => {
  return AdminModel.findOne({ _id, email });
};

//finding user details for order
exports.findUser = (userid) => {
  return AdminModel.findOne({ _id: userid });
};
