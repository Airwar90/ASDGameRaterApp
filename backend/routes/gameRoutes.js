const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController')
const validateToken = require('../middleware/auth');

//protect all game routes
router.use(validateToken);
router.get('/search', (req,res)=>{
    res.json({message:'Search endpoint'});
});
router.get('/user-ratings', ratingController.getAllUserRatings);
router.post('/rate', ratingController.addRating);
router.put('/update-rate/:id', ratingController.updateRating);
router.delete('/delete/:id', ratingController.deleteRating);


module.exports = router;