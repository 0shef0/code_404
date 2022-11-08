const db = require("../models");
const Posts = db.post
const Category = db.category
const Like = db.like
const Comment = db.comment
const User = db.user

const Op = db.Sequelize.Op;

exports.createPost = (req, res) => {
    if(!req.body.title ||
        !req.body.content) {
            res.status(500).send({message: "fill all fields"})
        } else {
    Posts.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        userId: req.userId
    }).then(post => {
        if(req.body.categories) {
            Category.findAll({
                where: {
                    title: {
                        [Op.or]: req.body.categories
                    }
                }
            }).then(category => {
                post.setCategories(category).then(() => {
                    res.send({message: "Post created"})
                })
            })
        } else { 
            return res.send("No category")
        }
    }).catch(err => {
        res.status(500).send({message: err.message})
    })
}
}

exports.createComment = (req, res) => {
    if(!req.body.content) {
            res.status(500).send({message: "fill all fields"})
        } else {
    Posts.findOne({where: {
        id: req.params.post_id
    }}).then(post => {
        if(!post){
            return res.status(500).send({message: "post not found"})
        }
        Comment.create({
            content: req.body.content,
            postId: req.params.post_id,
            userId: req.userId
        }).then(comment => {
            if(!comment) {
                return res.status(500).send({message: "something wrong"})
            }
            res.status(200).send({message: "comment added"})
        })
    })
}
}

exports.createLike = (req, res) => {
    Like.findOne({where: {
        postId: req.params.post_id,
        userId: req.userId
    }}).then(found => {
        if(!found) {
            Posts.findOne({where: {
                id: req.params.post_id
            }}).then(post => {
                if(!post) {
                    return res.status(500).send({message: "post not found"})
                }
                Like.create({
                    type: req.body.type,
                    userId: req.userId,
                    postId: req.params.post_id
                })
                if(req.body.type === "like")
                    post.likesCount += 1
                else if (req.body.type === "dislike")
                post.likesCount -= 1
                post.save()
                res.status(200).send({message: "like added"})
            })
        } else {
            return res.status(500).send({message: "you liked this post"})
        }
    })
}

exports.deleteLike = (req, res) => {
    Like.findOne({where: {
        postId: req.params.post_id,
        userId: req.userId
    }}).then(like => {
        if(!like) {
            return res.status(500).send({message: "like not found"})
        }
        var action =-1
        if(like.type === "like"){
            action = 1
        }
        Posts.findOne({where: { 
            id: req.params.post_id}}).then(post => {
            post.likesCount -= action
            post.save()
        })
        Like.destroy({where: {
            postId: req.params.post_id,
            userId: req.userId
        }})
        res.status(200).send({message: "like deleted"})
    })
}

exports.getLikesFromPost = (req, res) => {
    Posts.findOne({where: {
        id: req.params.post_id
    }, include: [
        {
            model: Like,
            as: "likes",
            include: [
                {
                    model: User,
                    as: 'user',
                }
            ]
        }
    ]}).then(post => {
        if(!post){
           return  res.status(500).send({message: "post not found"})
        }
        res.status(200).send(post.likes)
    })
}

exports.getCommentsFromPost = (req, res) => {
    Posts.findOne({where: {
        id: req.params.post_id
    }, include: [
        {
            model: Comment,
            as: "comments",
            include: [
                {
                    model: User,
                    as: 'user',
                }
        ]}
    ]}).then(post => {
        if(!post){
           return  res.status(500).send({message: "post not found"})
        }
        res.status(200).send(post.comments)
    })
}

exports.getCategoriesFromPost = (req, res) => {
    Posts.findOne({where: {
        id: req.params.post_id
    }, include: [
        {
            model: Category,
            as: "categories"
        }
    ]}).then(post => {
        if(!post){
            return res.status(500).send({message: "post not found"})
        }
        res.status(200).send(post.categories)
    })
}

exports.getAllPosts = (req, res) => {
    if(req.body.filterBy) {
        if(req.body.filterBy.category) {
            Posts.findAll(
                {include: [
                    {
                        model: Category,
                        as: 'categories',
                        where: {
                            title: req.body.filterBy.category
                        }
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ]},
                {order:
                    [
                       ["likesCount", "DESK"]
                   ]},
                ).then(post => {
                    if(!post) {
                        return res.status(500).send({message: "posts not found"})
                    }
                    res.status(200).send(post)
                })
        }
    } else if(req.body.sortOption) {
        if(req.body.sortOrder){
            Posts.findAll(
                {include: [
                    {
                        model: Category,
                        as: 'categories',
                    },
                    {
                        model: User,
                        as: 'user',
                    }
                ]},
                {order: [[req.body.sortOption, req.body.sortOrder]]}).then(post => {
                return res.status(200).send(post)
            })    
        }
        Posts.findAll(
        {include: [
            {
                model: Category,
                as: 'categories',
            },
            {
                model: User,
                as: 'user',
            }
        ]}, {order: [[req.body.sortOption, "DESC"]]}).then(post => {
            return res.status(200).send(post)
        })
    } else {
    Posts.findAll(
    {include: [
        {
            model: Category,
            as: 'categories',
        },
        {
            model: User,
            as: 'user',
        }
    ]},
    {order: [["likesCount", "DESC"]]}).then(post => {
        res.status(200).send(post)
    })
}
}

exports.getPost = (req,res) => {
    Posts.findOne({
        where: {
            id: req.params.post_id
        },
        include: [
            {
                model: Category,
                as: 'categories',
            },
            {
                model: User,
                as: 'user',
            }
        ]
    }).then(post => {
        if(!post) {
            return res.status(500).send({message: "not found"})
        }
        res.status(200).send(post)
    })
}

exports.deletePost = (req, res) => {
    Posts.findOne({where: {
        id: req.params.post_id
    }, include: [
        {
            model: Comment,
            as: "comments"
        }
    ]}).then(post => {
        if(!post){
            return res.status(500).send({message: "post not found"})
        }
        if(post.userId != req.userId){
            if(req.isAdmin === false) {
                return res.status(500).send({message: "you're not admin or author of this post"})
            }
        }
        Like.destroy({where: {
            postId: post.id
        }})
        post.comments.forEach(elem => {
            Like.destroy({where: {
                commentId: elem.id
            }})
        })
        Comment.destroy({where: {
            postId: post.id
        }})
        Posts.destroy({where: {
            id: post.id
        }}).catch(err => {
            return res.status(500).send({message: err.message})
        })
        res.status(200).send("deleted")
    })
}

exports.updatePost = (req, res) => {
    Posts.findOne({where: {
        id: req.params.post_id
    }, include: [
        {
            model: Category,
            as: 'categories'
        }
    ]}).then(post => {
        if(!post){
            return res.status(500).send({message: "post not found"})
        }
        if(post.userId != req.userId) {
            if(req.isAdmin === false) {
                return res.status(500).send({message: "you're not the author of this post"})
            }
        }
        if(req.body.title){
            post.title = req.body.title
        }
        if(req.body.content) {
            post.content = req.body.content
        }
        if(req.body.categories) {
            Category.findAll({where: {
                    title: {
                        [Op.or]: post.categories.title
                    }
                }
            }).then(found => {
                post.removeCategories(found)
            })

            Category.findAll({
                where: {
                    title: {
                        [Op.or]: req.body.categories
                    }
                }
            }).then(category => {
                post.setCategories(category)
            })
        }
        if(req.body.status) {
            post.status = req.body.status
        }
        post.save()
        res.status(200).send(post.categories)
    })
}