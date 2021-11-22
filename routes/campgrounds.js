const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');;
const { isLoggedIn, isAuthorized, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })

router.get('/', campgroundController.getAll);

router.post('/', isLoggedIn, upload.array('images'), validateCampground, campgroundController.create);

router.get('/new', isLoggedIn, campgroundController.renderNewForm);

router.get('/:id', campgroundController.getById);

router.delete('/:id', isLoggedIn, isAuthorized, campgroundController.delete);

router.put('/:id', isLoggedIn, isAuthorized, validateCampground, campgroundController.edit);

router.get('/:id/edit', isLoggedIn, isAuthorized, campgroundController.renderEditForm);


module.exports = router