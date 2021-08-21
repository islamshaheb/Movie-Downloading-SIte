/** @format */
const multer = require('@koa/multer');
const upload = multer();
const koaCompose = require('koa-compose');
const Router = require('koa-router');
const routers = new Router();
const adminController = require('./controller.js/admin');
const movieController = require('./controller.js/movie');

routers.get('/', movieController.allYear);
routers.get('/:year', movieController.year);
routers.get('/link/:link', movieController.link);
routers.post('/admin', adminController.register);
routers.post('/addmovie', movieController.register);

module.exports = routers;
