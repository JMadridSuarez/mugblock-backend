const service = require('../services/services')

const getAllArticles = service.getAllArticles;

const getOneArticle= service.getOneArticle;

const getUserArticles = service.getUserArticles;

const postArticle = service.postArticle;

const updateArticle = service.updateArticle;

const deleteArticle = service.deleteArticle;

const uploadImage = service.uploadImage;

const getOneImage = service.getOneImage;

const search = service.search;

const signUp = service.signUp;

const login = service.login;

module.exports ={
    getAllArticles,
    getOneArticle,
    getUserArticles,
    postArticle,
    updateArticle,
    deleteArticle,
    uploadImage,
    getOneImage,
    search,
    signUp,
    login
}