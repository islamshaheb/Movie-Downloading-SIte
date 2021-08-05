/** @format */

'use strict';

const Validator = require('validatorjs');
const jwt = require('jsonwebtoken');
const adminModel = require('../model/Admin');
const registerRules = {
  email: 'required|email',
  password: 'required|min:8',
};

const loginRules = {
  email: 'required|email',
  password: 'required|min:8',
};

const userInfoRules = {
  fullName: 'required',
  phoneNumber: 'required',
};

exports.register = async (ctx) => {
  try {
    const request = ctx.request.body;
    const validation = new Validator(request, registerRules);
    if (validation.fails()) {
      throw {
        status: 400,
        message: 'Invalid request',
        error: validation.errors.all(),
      };
    }
    const hasDuplicate = await adminModel.checkDuplicacy(request.email);
    if (hasDuplicate) {
      throw {
        status: 400,
        message: 'Email address already registered',
      };
    }
    await adminModel.create(request);

    ctx.body = {
      message: 'Successfully registered',
    };
  } catch (e) {
    const { status, message, error } = e;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};

exports.login = async (ctx) => {
  try {
    const request = ctx.request.body;

    const validation = new Validator(request, loginRules);
    if (validation.fails()) {
      throw {
        status: 400,
        message: 'Invalid request',
        error: validation.errors.all(),
      };
    }
    const isMatch = await adminModel.checkExistence(request.email, request.password);
    if (!isMatch) {
      throw {
        status: 400,
        message: 'Email/password do not match',
      };
    }
    const userInfo = await adminModel.checkExistence(request.email, request.password);
    const userObject = {
      userId: userInfo._id,
      password: userInfo.password,
      email: userInfo.email,
    };
    const token = jwt.sign({ userObject }, variables.secret);
    ctx.body = {
      message: 'login Successful',
      token,
    };
  } catch (e) {
    const { status, message, error } = e;

    ctx.status = status;
    ctx.body = { message, error };
  }
};

exports.createUser = async (ctx) => {
  try {
    const { fullName, phoneNumber } = ctx.request.body;

    const { userid } = ctx.request.headers;
    const userId = userid;

    const validation = new Validator(ctx.request.body, userInfoRules);

    if (validation.fails()) {
      throw {
        status: 400,
        message: 'You must enter both your name and phone number',
        error: validation.errors.all(),
      };
    }

    const convertedImage = await utility.toaBase64(ctx.file.buffer);

    const maxSize = variables.maximumImageSize;

    // Ignore if file size is bigger than 50kb
    if (ctx.file.size > maxSize * 1024) {
      throw {
        status: 400,
        message: `File size has to  be less than ${maxSize}kb `,
      };
    }

    // saving products related informations onto the database

    const information = {
      fullName,
      phoneNumber,
      image: convertedImage,
    };
    const returnedInfo = await adminModel.updateUserInfo(userId, information);

    ctx.body = {
      data: returnedInfo,
      status: 200,
      message: `Sccuessfully saved information. `,
    };
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};
