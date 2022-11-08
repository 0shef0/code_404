const db = require("../models");
const Like = db.like
const Comment = db.comment

exports.getComment = (req, res) => {
    Comment.findOne({where: {
        id: req.params.comment_id
    }}).then(comment => {
        if(!comment) {
            return res.status(500).send({message: "comment not found"})
        }
        res.status(200).send(comment)
    })
}

exports.getLikesFromComment = (req, res) => {
    Comment.findOne({where: {
        id: req.params.comment_id
    }, include: [
        {
            model: Like,
            as: "likes"
        }
    ]}).then(comment => {
        if(!comment){
            return es.status(500).send({message: "comment not found"})
        }
        res.status(200).send(comment.likes)
    })
}

exports.createLike = (req, res) => {
    Like.findOne({where: {
        commentId: req.params.comment_id,
        userId: req.userId
    }}).then(found => {
        if(!found) {
            Comment.findOne({where: {
                id: req.params.comment_id
            }}).then(comment => {
                if(!comment) {
                    return res.status(500).send({message: "comment not found"})
                }
                Like.create({
                    type: req.body.type,
                    userId: req.userId,
                    commentId: req.params.comment_id
                })
                res.status(200).send({message: "like added"})
            })
        } else {
            return res.status(500).send({message: "you liked this comment"})
        }
    })
}

exports.deleteLike = (req, res) => {
    Like.findOne({where: {
        commentId: req.params.comment_id,
        userId: req.userId
    }}).then(like => {
        if(!like) {
            res.status(500).send({message: "like not found"})
        } else {
        Like.destroy({where: {
            commentId: req.params.comment_id,
            userId: req.userId
        }})
        res.status(200).send({message: "like deleted"})
        }
    })
}

exports.deleteComment = (req, res) => {
    Comment.findOne({where: {
        id: req.params.comment_id
    }}).then(comment => {
        if(!comment) {
            return res.status(500).send({message: "comment not found"})
        }
        if(req.userId != comment.userId){
            if(req.isAdmin === false) {
                return res.status(500).send({message: "you're not the author of this comment"})
            }
        }
        Like.destroy({where: {
            commentId: comment.id
        }})
        Comment.destroy({where: {
            id: req.params.comment_id
        }})
        res.status(200).send({message: "comment deleted"})
    })
    
}

exports.updateComment = (req, res) => {
    Comment.findOne({where: {
        id: req.params.comment_id
    }}).then(comment => {
        if(!comment){
            return res.status(500).send({message: "post not found"})
        }
        if(comment.userId != req.userId) {
            if(req.isAdmin === false) {
                return res.status(500).send({message: "you're not the author of this post"})
            }
        }
        if(req.body.title){
            comment.title = req.body.title
        }
        if(req.body.content) {
            comment.content = req.body.content
        }
        comment.save()
        res.status(200).send(comment)
    })
}