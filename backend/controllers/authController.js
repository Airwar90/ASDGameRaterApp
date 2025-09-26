const {db, fetchAll, fetchFirst, runAsync} =require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

exports.register = async (req, res) => {
    console.log('user registration request...');
    const {username, email, password, confirmedPassword } = req.body;
    //input validation
    if (!username || !email || !password || !confirmedPassword) {
    return res.status(400).json({ message: 'all fields are required' });
    }
    //pwd length requirement
    if (password.length < 8) {
    return res
      .status(400)
      .json({ message: 'password must be at least 8 characters' });
    }
    if (password !== confirmedPassword) {
    return res.status(400).json({ message: 'passwords do not match' });
    }
    try {
        //check if username is already used
        let nameSql = `select * from users where username = ?`;
        const user = await fetchFirst(db, nameSql, [username]); 
        if(user) {
            return res.status(400).json({message: "username already exists"});
        }
        //checks if email is already used
        let emailSql = `select * from users where email = ?`;
        const existingEmail = await fetchFirst(db,emailSql, [email]);
        if(existingEmail){
            return res.status(400).json({message: "email already used"});
        }
        
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //add user to table
        let addSql = `insert into users(username, email, password) values (?,?,?)`;
        let values = [username, email, hashedPassword];
        const newUser = await runAsync(db, addSql, values);
        const newUserId = newUser.lastID; 
        console.log("New User Created");        

        const token = jwt.sign({id: newUserId}, JWT_SECRET, {expiresIn: "1d"});               
        return res.status(200).json({
                message: 'registration successful',
                token,
                user: {
                    id: newUserId,
                    username: username,
                    email: email
                }
        });                                
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "server error", error: error.message});
    }
}

exports.login = async (req, res) => {
    console.log('User Log in request..');
    const {email, password} = req.body;
    try {
        //look for user and get password
        let getUserSql = `select id, username, email, password from users where email = ?`;
        const user = await fetchFirst(db, getUserSql, [email]);            
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message: 'Wrong email or password'});
            }
            const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: "1d"});
            console.log('Log in successful');
            return res.status(200).json({
                message: 'log in successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.status(400).json({message: 'Wrong email or password'});
        }        
    } catch (error){
        console.error(error);
        res.status(500).json({message: "server error", error: error.message});
    }
}