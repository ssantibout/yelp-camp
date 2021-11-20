const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');;
const { isLoggedIn, isAuthorized, validateCampground } = require('../middleware');

router.get('/', campgroundController.getAll);

router.post('/', isLoggedIn, validateCampground, campgroundController.create);

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.get('/:id', campgroundController.getById);

router.delete('/:id', isLoggedIn, isAuthorized, campgroundController.delete);

router.put('/:id', isLoggedIn, isAuthorized, validateCampground, campgroundController.edit);

router.get('/:id/edit', isLoggedIn, isAuthorized, campgroundController.renderEditForm);


module.exports = router