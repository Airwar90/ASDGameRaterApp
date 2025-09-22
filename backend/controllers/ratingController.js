const db = require('../database/database');

exports.addRating = async (req, res) => {
    const {gameId, rating} = req.body;
    const userId= req.user.id;

    //input validation
    if(!gameId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({message: 'Bad add rating request'});
    }

    try{
        //check if game is already rated by user
        let gameSql = `select * from ratings where game_id = ? and user_id = ?`;
        db.get(gameSql, [gameId, userId], (err, existingRating) => {
            if (err){
                return res.status(500).json({message: 'db error'});            
            }
            if (existingRating) {
                return res.status(400).json({message: 'Game already rated'});
            }
            //add new rating
            let addSql = `insert into ratings(game_id, rating, user_id) values (?,?,?) `;
            let values = [gameId, rating, userId];
            db.run(addSql, values, (err)=> {
                if (err){
                    return res.status(500).json({message: 'db error'});            
                }
                return res.status(201).json({message: "rating added"});
            });
        });        

    } catch (error) {
        return res.status(500).json({message: 'error adding rating'});
    }
}

exports.updateRating = async (req, res) => {
    const {id} = req.params;
    const {rating} = req.body;
    const userId = req.user.id;
    
    //input validation
    if(!rating || rating <1 || rating > 5) {
        return res.status(400).json({message: 'bad rating request'});
    }

    try {
        //select rating with id
        let ratingSql = `select * from ratings where id = ?`;        
        db.get(ratingSql, [id], (err, selectedRating) => {
            if (err) {
                return res.status(500).json({message: 'db error'});
            }
            if (selectedRating) {
                //check user created rating
                if (selectedRating.user_id == userId) {
                    //update
                    let updateSql = `update ratings set rating = ? where id = ?`;
                    db.run(updateSql, [rating, id], (err)=> {
                        if (err) {
                            return res.status(500).json({message: 'db error'});
                        }
                        return res.status(201).json({message: 'rating updated'});
                    });
                    
                } else {
                    return res.status(403).json({message: 'rating does not belong to user'});
                }
            } else {
                return res.status(404).json({message:'no rating found at id'});
            }
        })
    } catch (error) {
        return res.status(500).json({message: 'error updating rating'});
    }
}

exports.getAllUserRatings = async (req,res) => {

}

exports.deleteRating = async (req, res) => {
    
}