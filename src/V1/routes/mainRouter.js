const {Router} = require('express');
const controller = require('../../controllers/controllers')
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, process.cwd()+'/src/images/');
    },

    filename: function(req,file,cb){
        cb(null,"article" + Date.now() + file.originalname);
    }
})

const uploadsMidleware = multer({storage: storage});

const router = Router();

router
    .get('/articles',controller.getAllArticles)
    .get('/articles/:id', controller.getOneArticle)
    .get('/article/:email', controller.getUserArticles)
    .post('/articles', controller.postArticle)
    .put('/articles/:id',controller.updateArticle)
    .delete('/articles/:id',controller.deleteArticle)
    .post('/upload/:id',[uploadsMidleware.single("file0")], controller.uploadImage)
    .get('/image/:directory', controller.getOneImage)
    .get('/search/:search', controller.search)
    .post('/signup', controller.signUp)
    .post('/login', controller.login)

module.exports = router