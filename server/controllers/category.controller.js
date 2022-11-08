const db = require("../models");
const Posts = db.post
const Category = db.category

exports.createCategory = (req, res) => {
    if(!req.body.title ||
        !req.body.description) {
            res.status(500).send({message: "fill all fields"})
        } else {
    Category.findOne({where: {
        title: req.body.title
    }}).then(category => {
        if(category) {
            return res.status(500).send({message: "category already exists"})
        }
        Category.create({
            title: req.body.title,
            description: req.body.description
        })
        res.send(200).send({message: "Category created"})
    })
} 
}

exports.getCategory = (req, res) => {
    Category.findOne({
        where: {
            id: req.params.category_id
        }
    }).then(category =>{
        if(!category) {
            return res.status(500).send({message: "category not found"})
        }
        res.status(200).send(category)
    })
}

exports.getPostFromCategory = (req, res) => {
    Category.findAll({where: {
        id: req.params.category_id
    }, include: 
        [
            {
            model: Posts,
            as: "posts"
            }
        ]
    }).then(category => {
        if(!category) {
            return res.status(500).send({message: "category not found"})
        }
        res.status(200).send(category.posts)
    })
}

exports.getCategories = (req, res) => {
    Category.findAll().then(category => { 
        res.status(200).send(category)
    })
}

exports.updateCategory = (req, res) => {
    Category.findOne({where: {
        id: req.params.category_id
    }}).then(category => {
        if(!category){
            return res.status(500).send({message: "category not found"})
        }
        if(req.body.title){
            category.title = req.body.title
        }
        if(req.body.description){
            category.description = req.body.description
        }
        category.save()
        res.status(200).send(category)
    })
}

exports.deleteCategory = (req, res) => {
    Category.destroy({where: {
        id: req.params.category_id
    }}).catch(err => {
        return res.status(500).send({message: err.message})
    })
    res.status(200).send("deleted")
}