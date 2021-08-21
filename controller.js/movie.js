/** @format */

'use strict';

const Validator = require('validatorjs');
const jwt = require('jsonwebtoken');
const movieModel = require('../model/AddMovie');

const registerRules = {
  Name: 'required',
  Year: 'required',
  Link: 'required',
};

exports.register = async (ctx) => {
  try {
    let request = ctx.request.body;
    const validation = new Validator(request, registerRules);

    if (validation.fails()) {
      throw {
        status: 400,
        message: 'Invalid request',
        error: validation.errors.all(),
      };
    }
    request.Name = request.Name.toUpperCase().trim();
    const hasDuplicate = await movieModel.checkDuplicacy(request.Name);

    if (hasDuplicate) {
      throw {
        status: 400,
        message: 'Movie already added !!',
      };
    }
    await movieModel.create(request);
    ctx.body = {
      message: 'Movie added successfully ',
    };
  } catch (e) {
    const { status, message, error } = e;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};

exports.allYear = async (ctx) => {
  try {
    const movieList = await movieModel.findYear();

    if (!movieList) {
      throw {
        status: 400,
        message: 'No Movie Found !!',
      };
    }
    const movieListFromYear = movieList.map((name) => name._id);
    throw {
      status: 200,
      message: {
        mess: 'all Movie List',
        yearList: movieListFromYear,
      },
    };
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};

exports.year = async (ctx) => {
  try {
    const curYear = ctx.params.year;
    const query = ctx.query;
    if (!Object.keys(query).length) {
      const movieList = await movieModel.findYearAllMovie(parseInt(curYear));
      if (!movieList) {
        throw {
          status: 400,
          message: 'No Movie Found !!',
        };
      }
      const movieListFromYear = movieList.map((list) => list.Name);
      throw {
        status: 200,
        message: {
          mess: 'all Movie List',
          yearList: movieListFromYear,
        },
      };
    } else {
      let { name } = query;
      const nameInCapital = name.toUpperCase();

      const movieInformation = await movieModel.findMovieOfaParticularYear(
        parseInt(curYear),
        nameInCapital
      );
      const movieLink = movieInformation.map((list) => list.Link);
      throw {
        status: 200,
        message: {
          mess: 'Your selected movie list',
          movieLink: movieLink,
        },
      };
    }
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};

exports.link = async (ctx) => {
  try {
    const curName = ctx.params.link;
    console.log({ curName });
    const movieLink = await movieModel.findLink(curName);

    if (!movieLink) {
      throw {
        status: 400,
        curName,
        message: 'No Link Found !!',
      };
    }

    throw {
      status: 200,
      message: {
        link: movieLink.Link,
      },
    };
  } catch (err) {
    const { status, message, error } = err;
    ctx.status = status || 500;
    ctx.body = { message, error };
  }
};
