const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(authMiddleware);

router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.get('/:categoryId', mediaController.getMediaByCategory);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
