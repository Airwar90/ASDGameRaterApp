const express = require('express');
const router = express.Router();

const validateToken = require('../middleware/auth');

//protect all game routes
router.use(validateToken);
router.get('/search', (req,res)=>{
    res.json({message:'Search endpoint'});
});
router.get('/user-ratings', (req, res) => {
    res.json({message: "all ratings endpoint"});
});
router.post('/rate', (req, res) => {
    res.json({message:'send rate endpoint'});    
});
router.put('/update-rate/:id', (req, res) => {
    res.json({message:'Update rate endpoint'});    
});
router.delete('/delete/:id', (req,res) => {
    res.json({message: 'Delete rating endpoint'});
});


module.exports = router;