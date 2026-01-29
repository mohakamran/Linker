const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.get('/:shareId', shareController.getSharedCategory);

module.exports = router;
