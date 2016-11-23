var express = require('express');
var router = express.Router();
var article = require('../model/db.js');

/* GET /articles listing. */
router.get('/admin', function(req, res, next) {
    article.find(function(err, docs) {
        if (err) return next(err);
        res.render('admin', {
            title: docs.tittle,
            author: docs.author,
            summary: docs.summary,
            articles: docs,
        });
    });
});

/* POST /articles */
router.post('/', function(req, res, next) {
    article.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /articles/id */
router.get('/:id', function(req, res, next) {
    article.findById(req.params.id, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /articles/:id */
router.put('/:id', function(req, res, next) {
    article.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /articles/:id */
router.delete('/:id', function(req, res, next) {
    article.findByIdAndRemove(req.params.id, req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
