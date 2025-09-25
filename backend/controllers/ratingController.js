const {db, fetchAll, fetchFirst, runAsync} =require('../database/database');
const { igdbQuery } = require('./igdbController');

exports.addRating = async (req, res) => {
    const {gameId, rating} = req.body;
    const userId= req.user?.id;

    //input validation
    if(!userId||!gameId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({message: 'Bad add rating request'});
    }
    try {
        //check if game is already rated by user
        let gameSql = `select * from ratings where game_id = ? and user_id = ?`;
        const existingRating = await fetchFirst(db, gameSql, [gameId, userId]);            
        if (existingRating) {
            return res.status(400).json({message: 'Game already rated'});
        }
        //add new rating
        let addSql = `insert into ratings(game_id, rating, user_id) values (?,?,?) `;
        let values = [gameId, rating, userId];
        await runAsync(db,addSql, values);            
        return res.status(201).json({message: "rating added"});
    } catch (error) {
        console.error(err);
        return res.status(500).json({message: 'error adding rating'});
    }
}

exports.updateRating = async (req, res) => {
    const {id} = req.params;
    const {rating} = req.body;
    const userId = req.user?.id;
    
    //input validation
    if(!userId || !rating || rating <1 || rating > 5) {
        return res.status(400).json({message: 'bad rating request'});
    }

    try {
        //select rating with id
        let ratingSql = `select * from ratings where id = ?`;        
        const selectedRating = await fetchFirst(db,ratingSql, [id]);          
        if (selectedRating) {
            //check user created rating
            if (selectedRating.user_id == userId) {
                //update
                let updateSql = `update ratings set rating = ? where id = ?`;
                await runAsync(db,updateSql, [rating, id]);
                return res.status(201).json({message: 'rating updated'});
            } else {
                return res.status(403).json({message: 'rating does not belong to user'});
            }
        } else {
            return res.status(404).json({message:'no rating found at id'});
        }        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'error updating rating'});
    }
}

exports.getAllUserRatings = async (req,res) => {
    const {userId} = req.body;
    if(!userId) {
        return res.status(400).json({message: 'Missing user id'});
    }
    try{
        userRatingsSql = `select * from ratings where user_id = ?`;
        const rows = await fetchAll(db,userRatingsSql, [userId]);
        //build array of game ids
        const gameIds = [...new Set(rows.map(r=>r.game_id))];
        console.log(gameIds);
        if (gameIds.length === 0) {
            return res.json([]);
        }
        const idList = gameIds.join(',');
        console.log(idList);               
        let query = `fields id,name,cover.url; where id = (${idList}); `;
        const data = await igdbQuery(query);
        const dataWithNormalisedUrl = data.map(game => ({
            ...game,
            cover: game.cover?.url ? `https:${game.cover.url}` : null
        }));
        console.dir(dataWithNormalisedUrl, { depth: null });

        const games = {}; 
        dataWithNormalisedUrl.forEach(g=>(games[g.id] = g));
        
        const completeRatingInfo = rows.map(r => ({
            id: r.id,
            user_id: r.user_id,
            rating: r.rating,
            game: games[r.game_id] || {id: r.game_id}
        }));
        return res.status(200).json(completeRatingInfo);        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'error loading ratings'});
    }    
}

exports.deleteRating = async (req, res) => {
    const {id} = req.params;
    if(!id) {
        return res.status(400).json({message: 'Missing rating id for deletion'});
    }
    try{
        let deleteSql = `delete from ratings where id=?`;
    await runAsync(db, deleteSql, [id]);
    return res.status(200).json({message: 'rating deleted'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'error deleting rating'});
    }
}