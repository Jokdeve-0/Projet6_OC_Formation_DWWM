const Sauce = require('../models/Sauce')
const {
    authControl
} = require('./authControl')
const fs = require('fs')

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    sauceObject.likes = 0
    sauceObject.dislikes = 0
    sauceObject.usersLiked = []
    sauceObject.usersDisliked = []
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({
            message: 'The new sauce was created !'
        }))
        .catch(error => res.status(400).json({
            error
        }))
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    if (authControl(sauceObject.userId, res.locals.currentUserId)) {
        if (req.file) {
            Sauce.findOne({
                    _id: req.params.id
                })
                .then(sauce => {
                    fs.unlink(`images/${sauce.imageUrl.substr(sauce.imageUrl.indexOf('/images/')+8)}`, err => err ? console.log(err) : console.log("Old image is removed"))
                })
                .catch(error => res.status(400).json({
                    error
                }))
        }
        Sauce.updateOne({
                _id: req.params.id
            }, {
                ...sauceObject,
                _id: req.params.id
            })
            .then(() => res.status(200).json({
                message: 'The sauce has been modified !'
            }))
            .catch(error => res.status(400).json({
                error
            }))
    } else {
        res.status(403).json({
            message: ' unauthorized request'
        })
    }
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            if (authControl(sauce.userId, res.locals.currentUserId)) {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({
                            _id: req.params.id
                        })
                        .then(() => res.status(200).json({
                            message: 'The sauce has been removed !'
                        }))
                        .catch(error => res.status(400).json({
                            error
                        }))
                })
            } else {
                res.status(403).json({
                    message: ' unauthorized request'
                })
            }
        })
        .catch(error => res.status(500).json({
            error
        }))
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }))
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }))
}

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            var swtMessage = ""
            switch (req.body.like) {
                case 0:
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        const indexDisLike = sauce.usersDisliked.indexOf(res.locals.currentUserId)
                        sauce.usersDisliked.splice(indexDisLike, 1)
                        sauce.dislikes--
                        swtMessage += 'You have removed your dislike'
                    }
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        const indexLike = sauce.usersLiked.indexOf(req.body.userId)
                        sauce.usersLiked.splice(indexLike, 1)
                        sauce.likes--
                        swtMessage += 'You have removed your like'
                    }
                    break
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked.push(req.body.userId)
                        sauce.likes++
                        swtMessage += 'You have liked the sauce'
                    } else {
                        res.status(202).json({
                            message: 'You already liked this sauce !'
                        })
                    }
                    break
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked.push(req.body.userId)
                        sauce.dislikes++
                        swtMessage += 'You have disliked the sauce'
                    } else {
                        res.status(202).json({
                            message: 'You already disliked this sauce!'
                        })
                    }
                    break
            }
            Sauce.updateOne({
                    _id: req.params.id
                }, {
                    likes: sauce.likes,
                    usersLiked: sauce.usersLiked,
                    dislikes: sauce.dislikes,
                    usersDisliked: sauce.usersDisliked,
                    _id: req.params.id
                })
                .then(() => res.status(200).json({
                    message: swtMessage
                }))
                .catch(error => res.status(400).json({
                    error
                }))
        })
        .catch(error => res.status(404).json({
            error
        }))
}