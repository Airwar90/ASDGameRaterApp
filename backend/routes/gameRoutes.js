const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const igdbController = require('../controllers/igdbController');
const validateToken = require('../middleware/auth');

//protect all game routes
router.use(validateToken);
router.post('/search', async (req, res) => await igdbController.getGameByName(req, res));
router.post('/userratings', ratingController.getAllUserRatings);
router.post('/rate', ratingController.addRating);
router.post('/update-rate/:id', ratingController.updateRating);
router.delete('/delete/:id', ratingController.deleteRating);


module.exports = router;