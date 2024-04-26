const pool = require('../database/db');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const getAllArticles = async(req,res) =>{
    try {
       const selectAllResponse = await pool.query(`SELECT * FROM articles;`);
        res.json(selectAllResponse.rows);
    } catch (error) {
        res.status(400).send('Failed select');
        
    }
}

const getOneArticle = async(req,res) =>{
    const {article_id} = req.params;
    try {
        const selectOneResponse = await pool.query('SELECT * FROM articles WHERE article_id = $1', [article_id]);
        await res.json(selectOneResponse.rows);
     } catch (error) {
        await res.status(400).send('Failed select');
     }
}

const getUserArticles =async(req,res) =>{
    const {email} = req.params;
    try {
      const userArticles = await pool.query('SELECT * FROM articles WHERE user_email = $1;',[email]);
       await res.json(userArticles.rows)
    } catch (error) {
        res.status(400).send('Failed select');
    }
}

const postArticle = async(req,res) =>{
    const id = uuidv4();
    const {email,title,content, date} = req.body;
    try {
    const postArticleResponse = await pool.query('INSERT INTO articles(article_id,user_email,title, content, date) VALUES($1,$2,$3,$4,$5);',
    [id,email,title,content,date])
    res.json(postArticleResponse)
    ;
    } catch (error) {
        res.status(400).send('Failed post');
        console.log(error);
    }
}

const updateArticle = async(req,res)=>{
    const {article_id} = req.params;
    const {title,content, date} = req.body;
    try {
        const updateArticleResponse = await pool.query('UPDATE articles SET title = $1, content = $2, date = $3 WHERE article_id = $4;',
    [title,content,date,article_id])
    res.json(updateArticleResponse)
    } catch (error) {
        res.status(400).send('Update failed');
        console.log(error);
    }
}

const deleteArticle = async(req,res)=>{
    const {id} = req.params;
    try {
        deleteArticleResponse = await pool.query('DELETE FROM articles WHERE article_id = $1',[id])
        res.json(deleteArticleResponse)
    } catch (error) {
        
    }
}

const uploadImage = async(req,res)=>{

    if(!req.file && !req.files){
        return res.status(404).json({
            status: 'error',
            message: 'Invalid Request'
        })
    }

    let fileName = req.file.originalname;
    let fileName_split = fileName.split('\.');
    let extension = fileName_split[1];

    

    if(extension != 'jpg' && extension != 'png' && extension != 'jpeg' && extension !=='gif'){
        return fs.unlink(req.file.path, (error)=>{
             res.status(400).json({
                error: 'Invalid Format'
            })
        })
    }else{
        //const id = uuidv4();
        const image = req.file.filename;
        const {id} = req.params;
        //const uploadedImage = await pool.query('INSERT INTO articles(article_id,image) VALUES($1,$2);',[id,image]);
        const uploadedImage = await pool.query('UPDATE articles SET image = $1 WHERE article_id = $2 ;',[image, id]);
        return res.json(uploadedImage);
    }
}

    const getOneImage = (req,res)=>{
        const directory = req.params.directory;
        const realRoute = process.cwd()+'/src/images/'+ directory;
        fs.stat(realRoute, (error,exist)=>{
            if(exist){
                return res.sendFile(path.resolve(realRoute));
            }else{
                return res.json({
                    status:'error',
                    exist,
                    directory,
                    realRoute
                })
            }
        })
    }

    const search = async(req,res)=>{
        const search = req.params.search;
        try {
            //const querySearch = await pool.query('SELECT * FROM articles WHERE title ~* \'^[A-Z][a-z0-9]*$\';');
            const querySearch = await pool.query('SELECT * FROM articles WHERE title ~* $1;',[search]);
            //const searchSorted = querySearch.sort({date: -1});
            //res.json(searchSorted.rows);
            res.json(querySearch.rows)
            
        } catch (error) {
            console.error(error);
        }
    }

    const signUp = async(req,res)=>{
        
        const id = uuidv4();
        const {name,lastname,email,password} = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashed_password = bcrypt.hashSync(password, salt);
        try {
        const response =  await pool.query('INSERT INTO users(id,name,lastname,email,password) VALUES($1, $2, $3, $4, $5);',
        [id,name,lastname,email,hashed_password]);

        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        
         
        } catch (error) {
            
            if (error){
                res.json({detail: error.detail})
            }
        }
    }

    const login = async(req,res) =>{
        const {email, password} = req.body;
        try {
            const loginResponse = await pool.query('SELECT * FROM users WHERE email = $1;',[email]);
        
        if(!loginResponse.rows.length) return res.json({detail: 'User does not exist!'});
        const success = await bcrypt.compare(password , loginResponse.rows[0].password);
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
            if(success){
              const data = await res.json({'email': loginResponse.rows[0].email, token})
              console.log(data)
            }else{
                res.json({detail: 'Login failed'})
            }
        } catch (error) {
            res.send(error);
        }
    }
module.exports = {
    getAllArticles,
    getUserArticles,
    getOneArticle,
    postArticle,
    updateArticle,
    deleteArticle,
    uploadImage,
    getOneImage,
    search,
    signUp,
    login
}