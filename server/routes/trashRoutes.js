const express = require('express');
const router = express.Router();
const trashController = require('../controllers/trashController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', trashController.getTrash);
router.post('/restore', trashController.restoreItem);
router.delete('/:type/:id', trashController.permanentDelete);

module.exports = router;
