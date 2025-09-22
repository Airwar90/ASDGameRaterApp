const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

exports.register = async (req, res) => {
    const {username, email, password, confirmedPassword } = req.body;
    try {
        //check if username is already used
        let nameSql = `select * from users where name = ?`;
        db.get(nameSql, [username], async (err, existingUsername) =>{
            if (err) {
                return res.status(500).json({message: "db error"});
            }
            if(existingUsername) {
                return res.status(400).json({message: "username already exists"});
            }
            //checks if email is already used
            let emailSql = `select * from users where email = ?`;
            db.get(emailSql, [email], async(err, existingEmail) => {
                if(err) {
                    return res.status(500).json({message: "db error"});
                }
                if(existingEmail){
                    return res.status(400).json({message: "email already used"});
                }
                if(confirmedPassword === password){
                    //hash password
                    const hashedPassword = await bcrypt.hash(password, 10);

                    //add user to table
                    let addSql = `insert into users(name, email, password) values (?,?,?)`;
                    let values = [username, email, hashedPassword];
                    db.run(addSql, values, (err) => {
                        if (err){
                            return res.status(500).json({message: "failed user creation"});
                        }
                        return res.status(201).json({message: "user created"});
                    });
                } else {
                    return res.status(400).json({message: 'passwords do not match'});
                }                
            });
        });                
    } catch (error) {
        res.status(500).json({message: "server error", error: error.message});
    }
}

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        //look for user and get password
        let getUserSql = `select id, name, email, password from users where email = ?`;
        db.get(getUserSql, [email], async (err, user) =>{
            if (err) {
                return res.status(500).json({message:'db error', error: err.message});
            }
            if(user){
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    return res.status(400).json({message: 'Wrong email or password'});
                }
                const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: "1d"});
                return res.status(200).json({
                    message: 'log in successful',
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.status(400).json({message: 'Wrong email or password'});
            }
        })
    } catch (error){
        res.status(500).json({message: "server error", error: error.message});
    }
}